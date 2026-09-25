/**
 * Build the isolated slide bundle the showcase page embeds.
 *
 * The showcase shows real slides, not pictures of them, because a picture
 * cannot build a transcript, follow an accent change, or demonstrate the
 * components the page is about. Loading a whole week's deck for each example
 * would be unacceptable on a page carrying several, so every example comes
 * from one small generated deck that imports only the slides the page asks
 * for.
 *
 * The deck is generated rather than authored. Each slot is a ranged import of
 * a single slide from its own chapter file, which is why the catalog records
 * where each alias resolved inside its source rather than only its position in
 * a resolved week.
 *
 * Output is content addressed. The same inputs produce the same directory, so
 * the course-site development server reuses a bundle the production build
 * already made instead of running Slidev again on every reload.
 */
import { createHash } from "node:crypto";
import {
    mkdir,
    readFile,
    readdir,
    rm,
    stat,
    writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { run } from "./process.mjs";

const moduleUrl = fileURLToPath(import.meta.url);
const SKIP_DIRECTORIES = new Set(["node_modules", "dist", ".cache", ".git"]);
/**
 * How many built bundles the cache keeps.
 *
 * Each one is several megabytes and a new fingerprint appears every time a
 * featured slide, the theme, the bridge, or the lockfile changes, so an
 * unbounded cache grows for as long as the course is worked on. More than one
 * is kept because switching back to a recent state, which undoing an edit or
 * checking out an earlier revision both do, should not rebuild.
 */
const RETAINED_BUNDLES = 4;
/**
 * How long a bundle with no completion marker is left alone. A build in
 * progress looks exactly like an abandoned one, so only the clearly abandoned
 * are removed.
 */
const ABANDONED_AFTER_MS = 30 * 60 * 1000;

export async function buildShowcasePreviews({
    slots,
    root,
    siteBase = "/",
    cacheRoot = path.join(root, ".cache", "showcase-previews"),
}) {
    if (slots.length === 0) return { directory: undefined, slots: [] };

    const themeDirectory = path.join(root, "packages", "slidev-theme-it230");
    const bridge = path.join(root, "site", "previews", "ShowcaseBridge.vue");
    const fingerprint = await fingerprintInputs({
        bridge,
        root,
        siteBase,
        slots,
        themeDirectory,
    });
    const directory = path.join(cacheRoot, fingerprint);
    const output = path.join(directory, "dist");

    if (await isComplete(directory)) {
        await evictOldBundles(cacheRoot, fingerprint);
        return { directory: output, slots };
    }

    await mkdir(directory, { recursive: true });
    await mkdir(path.join(directory, "setup"), { recursive: true });
    await writeFile(
        path.join(directory, "setup", "main.ts"),
        'import type { AppContext } from "@slidev/types";\n' +
            'export default ({ app }: AppContext) => { app.provide("it230-recording-speed", 1.5); };\n',
    );
    const entry = path.join(directory, "slides.md");
    await writeFile(entry, renderDeck({ directory, slots, themeDirectory }));
    await writeFile(
        path.join(directory, "global-bottom.vue"),
        renderGlobalBottom(directory, bridge),
    );

    await run(
        "slidev",
        [
            "build",
            entry,
            "--out",
            output,
            "--base",
            `${siteBase}showcase/previews/`,
            "--without-notes",
        ],
        { cwd: root },
    );

    await writeFile(path.join(directory, "complete"), "ok\n");
    await evictOldBundles(cacheRoot, fingerprint);
    return { directory: output, slots };
}

/**
 * Keep the cache to a bounded size.
 *
 * The bundle in use is kept whatever its age, then the most recently built of
 * the rest. The cache is disposable, so a directory that cannot be read or
 * removed is left where it is rather than failing a build over it: the worst
 * outcome is a bundle that survives one more round.
 */
async function evictOldBundles(cacheRoot, current) {
    const entries = await readdir(cacheRoot, { withFileTypes: true }).catch(
        () => [],
    );
    const bundles = [];
    for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === current) continue;
        const directory = path.join(cacheRoot, entry.name);
        const modified = await stat(directory)
            .then((stats) => stats.mtimeMs)
            .catch(() => undefined);
        if (modified === undefined) continue;
        bundles.push({
            complete: await isComplete(directory).catch(() => false),
            directory,
            modified,
        });
    }

    bundles.sort((first, second) => second.modified - first.modified);
    const now = Date.now();
    let kept = 1;
    for (const bundle of bundles) {
        if (!bundle.complete) {
            if (now - bundle.modified > ABANDONED_AFTER_MS)
                await rm(bundle.directory, {
                    force: true,
                    recursive: true,
                }).catch(() => {});
            continue;
        }
        kept += 1;
        if (kept <= RETAINED_BUNDLES) continue;
        await rm(bundle.directory, { force: true, recursive: true }).catch(
            () => {},
        );
    }
}

/**
 * Generate the preview deck.
 *
 * Each slot is one ranged import. The alias is repeated on the import block so
 * the route exists whatever the source slide happens to carry, and a single
 * slide per block means import-block frontmatter cannot leak onto neighbours.
 */
function renderDeck({ directory, slots, themeDirectory }) {
    const theme = toPosix(path.relative(directory, themeDirectory));
    const headmatter = [
        "---",
        `theme: ${JSON.stringify(theme)}`,
        "title: IT-230 showcase previews",
        "info: Generated bundle of the slides the showcase page embeds.",
        "routerMode: hash",
        "themeConfig:",
        "  it230Accent: blue",
        "selectable: true",
        "contextMenu: false",
        "wakeLock: false",
        "presenter: false",
        "browserExporter: false",
        "drawings:",
        "  enabled: false",
        "---",
        "",
        "# IT-230 showcase previews",
        "",
        "Generated. Every slide below is imported from published course material.",
        "",
    ].join("\n");

    const imports = slots
        .map((slot) => {
            const source = toPosix(
                path.relative(directory, slot.sourceAbsolute),
            );
            return [
                "---",
                `src: ${JSON.stringify(`${source}#${slot.sourceIndex + 1}`)}`,
                `routeAlias: ${slot.alias}`,
                "---",
                "",
            ].join("\n");
        })
        .join("\n");

    return `${headmatter}\n${imports}`;
}

function renderGlobalBottom(directory, bridge) {
    const relative = toPosix(path.relative(directory, bridge));
    return [
        "<script setup>",
        `import ShowcaseBridge from ${JSON.stringify(relative)};`,
        "</script>",
        "",
        "<template><ShowcaseBridge /></template>",
        "",
    ].join("\n");
}

async function isComplete(directory) {
    try {
        await readFile(path.join(directory, "complete"));
        return true;
    } catch (error) {
        if (error.code === "ENOENT") return false;
        throw error;
    }
}

/**
 * Hash everything that can change the built bundle.
 *
 * A stale bundle is worse than a slow one: it would show a slide that no
 * longer exists in the course while every check reported success.
 */
async function fingerprintInputs({
    bridge,
    root,
    siteBase,
    slots,
    themeDirectory,
}) {
    const hash = createHash("sha256");
    hash.update(
        JSON.stringify({
            siteBase,
            slots: slots.map((slot) => ({
                alias: slot.alias,
                source: toPosix(path.relative(root, slot.sourceAbsolute)),
                sourceIndex: slot.sourceIndex,
            })),
        }),
    );

    const files = new Set([
        bridge,
        moduleUrl,
        path.join(root, "pnpm-lock.yaml"),
        ...slots.map((slot) => slot.sourceAbsolute),
        ...(await listFiles(themeDirectory)),
    ]);
    for (const file of [...files].sort()) {
        hash.update(toPosix(path.relative(root, file)));
        hash.update(await readFile(file).catch(() => Buffer.alloc(0)));
    }
    return hash.digest("hex").slice(0, 20);
}

async function listFiles(directory) {
    const found = [];
    const entries = await readdir(directory, { withFileTypes: true }).catch(
        () => [],
    );
    for (const entry of entries) {
        if (entry.name.startsWith(".") || SKIP_DIRECTORIES.has(entry.name))
            continue;
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) found.push(...(await listFiles(full)));
        else if (entry.isFile()) found.push(full);
    }
    return found;
}

/**
 * Resolve declared slots against the catalog.
 *
 * The list of required slots is a parameter rather than a module constant so
 * the synthetic fixture week, which carries no showcase aliases, can build
 * without them.
 */
export function resolveShowcaseSlots(catalog, aliases) {
    const resolved = [];
    const missing = [];
    for (const alias of aliases) {
        const owners = catalog.presentations.filter((presentation) =>
            Object.hasOwn(presentation.routeAliases ?? {}, alias),
        );
        if (owners.length !== 1) {
            missing.push(
                owners.length === 0
                    ? `${alias} matches no published slide`
                    : `${alias} matches ${owners.length} published weeks: ${owners.map((o) => o.id).join(", ")}`,
            );
            continue;
        }
        const owner = owners[0];
        const entry = owner.routeAliases[alias];
        resolved.push({
            alias,
            slideNo: entry.slideNo,
            sourceAbsolute: entry.sourceAbsolute,
            sourceIndex: entry.sourceIndex,
            title: (entry.title ?? "").replaceAll("`", "").trim(),
            weekId: owner.id,
        });
    }
    if (missing.length > 0)
        throw new Error(
            `Showcase slots could not be resolved:\n  ${missing.join("\n  ")}\n` +
                "Move the matching routeAlias onto the slide each slot should show.",
        );
    return resolved;
}

function toPosix(value) {
    return value.split(path.sep).join("/");
}
