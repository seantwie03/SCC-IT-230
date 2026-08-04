import {
    mkdir,
    mkdtemp,
    readFile,
    readdir,
    rm,
    writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildRegisteredSite } from "./lib/build-site.mjs";
import { checkGeneratedSite } from "./lib/links.mjs";
import { loadRegistry } from "./lib/registry.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixtureRoot = path.join(root, "tests", "fixtures", "site");
const registry = await loadRegistry(
    path.join(fixtureRoot, "slides.config.mjs"),
    {
        root,
        courseRoot: "tests/fixtures/course",
    },
);
const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-site-"));

try {
    for (const siteBase of ["/", "/SCC-IT-230/"]) {
        const name = siteBase === "/" ? "root" : "project";
        const output = path.join(temporaryRoot, name, "dist");
        await mkdir(output, { recursive: true });
        await writeFile(path.join(output, "stale.txt"), "stale");
        await buildRegisteredSite({
            registry,
            root,
            distRoot: output,
            safetyRoot: path.join(temporaryRoot, name),
            siteBase,
        });
        await checkGeneratedSite({ distRoot: output, registry, siteBase });
        await assertFixtureOutput(output, siteBase);
        if (await fileExists(path.join(output, "stale.txt")))
            throw new Error("The production build retained stale output.");
    }
} finally {
    await Promise.all([
        rm(temporaryRoot, { force: true, recursive: true }),
        rm(path.join(root, "tests", "fixtures", "course", "node_modules"), {
            force: true,
            recursive: true,
        }),
    ]);
}

async function assertFixtureOutput(output, siteBase) {
    const landing = await readFile(path.join(output, "index.html"), "utf8");
    const expectedRoute = `${siteBase}it230-integration/`;
    if (!landing.includes(`href="${expectedRoute}"`))
        throw new Error(
            `Landing page did not use expected route ${expectedRoute}.`,
        );
    if (!landing.includes('href="./site.css"'))
        throw new Error(
            "Landing page did not retain its relative stylesheet reference.",
        );
    if (!landing.includes("Integration resource"))
        throw new Error("Landing page omitted the registered resource.");

    const generated = (await readGeneratedText(output)).toUpperCase();
    for (const expected of [
        "NAMED FRAGMENT",
        "--IT230-COLOR-CANVAS",
        "#9141AC",
    ]) {
        if (!generated.includes(expected))
            throw new Error(`Synthetic deck output omitted ${expected}.`);
    }
    if (generated.includes("IT230_PRESENTER_NOTE_MUST_NOT_SHIP"))
        throw new Error(
            "Synthetic presenter notes appeared in production output.",
        );
    if (
        !(await fileExists(
            path.join(output, "resources", "integration-resource.txt"),
        ))
    )
        throw new Error("The allowlisted resource was not copied.");
    if (
        !generated.includes(
            "THREE CONNECTED NODES LABELED SOURCE, BUILD, AND SITE",
        ) ||
        !(await containsGeneratedAsset(output, "integration-diagram", ".svg"))
    )
        throw new Error("The synthetic co-located asset was not processed.");
}

async function readGeneratedText(rootDirectory) {
    const values = [];
    for (const entry of await readdir(rootDirectory, { recursive: true })) {
        if (!/\.(?:css|html|js|svg|txt)$/.test(entry)) continue;
        values.push(await readFile(path.join(rootDirectory, entry), "utf8"));
    }
    return values.join("\n");
}

async function containsGeneratedAsset(rootDirectory, stem, extension) {
    return (await readdir(rootDirectory, { recursive: true })).some(
        (entry) =>
            path.basename(entry).includes(stem) &&
            path.extname(entry) === extension,
    );
}

async function fileExists(file) {
    try {
        await readFile(file);
        return true;
    } catch {
        return false;
    }
}
