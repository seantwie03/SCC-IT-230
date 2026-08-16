import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import net from "node:net";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import fixtureRegistry from "./fixtures/site/slides.config.mjs";
import {
    requireNoArguments,
    requireOneId,
    selectRegisteredPresentation,
    userArguments,
    validateFocusedEntry,
} from "../scripts/lib/arguments.mjs";
import { validateBuildOutputs } from "../scripts/lib/build-site.mjs";
import { createLandingPageDevServer } from "../scripts/lib/development.mjs";
import { checkGeneratedSite } from "../scripts/lib/links.mjs";
import {
    assertSafeGeneratedRoot,
    presentationRoute,
    validateSiteBase,
    withSiteBase,
} from "../scripts/lib/paths.mjs";
import {
    isSupportedPresentationId,
    loadRegistry,
    validateRegistry,
} from "../scripts/lib/registry.mjs";
import { renderLandingPage } from "../site/render-template.mjs";
import { assertPortAvailable } from "../scripts/lib/server.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixtureOptions = { root, courseRoot: "tests/fixtures/course" };

test("production registry contains the reviewed publications", async () => {
    const registry = await loadRegistry(path.join(root, "slides.config.mjs"), {
        root,
    });
    assert.deepEqual(
        registry.presentations.map(({ id }) => id),
        ["w01"],
    );
    assert.deepEqual(registry.resources, []);
});

test("valid fixture registry resolves its deck and resource", async () => {
    const registry = await validateRegistry(cloneFixture(), fixtureOptions);
    assert.equal(registry.presentations[0].id, "it230-integration");
    assert.equal(registry.presentations[0].accent, undefined);
    assert.match(registry.presentations[0].entryAbsolute, /example\.md$/);
    assert.match(registry.resources[0].sourceAbsolute, /resource\.txt$/);
});

test("registry rejects duplicates and unsupported fields", async () => {
    await assert.rejects(
        validateRegistry(null, fixtureOptions),
        /must export an object/,
    );
    await assert.rejects(
        validateRegistry(
            { presentations: [], resources: [], private: [] },
            fixtureOptions,
        ),
        /only presentations and resources/,
    );

    const duplicate = cloneFixture();
    duplicate.presentations.push({ ...duplicate.presentations[0] });
    await assert.rejects(
        validateRegistry(duplicate, fixtureOptions),
        /Duplicate presentation ID/,
    );

    const published = cloneFixture();
    published.presentations[0].published = true;
    await assert.rejects(
        validateRegistry(published, fixtureOptions),
        /unsupported or missing fields/,
    );
});

test("registry rejects invalid IDs, entries, and resources", async () => {
    const cases = [
        [
            (registry) => (registry.presentations[0].id = "week-01"),
            /unsupported ID/,
        ],
        [
            (registry) => (registry.presentations[0].entry = "../private.md"),
            /beneath tests\/fixtures\/course/,
        ],
        [
            (registry) =>
                (registry.presentations[0].entry =
                    "tests/fixtures/course/missing.md"),
            /does not exist/,
        ],
        [
            (registry) =>
                (registry.resources[0].path = "/resources/slides.pdf"),
            /cannot publish a standard Slidev PDF/,
        ],
        [
            (registry) =>
                (registry.resources[0].path = "/resources/%2e%2e/private.txt"),
            /canonical lowercase file/,
        ],
        [
            (registry) =>
                (registry.resources[0].path = "/resources/file.txt?download"),
            /canonical lowercase file/,
        ],
        [
            (registry) => (registry.resources[0].source = "../private.txt"),
            /not canonical/,
        ],
    ];

    for (const [mutate, expected] of cases) {
        const registry = cloneFixture();
        mutate(registry);
        await assert.rejects(
            validateRegistry(registry, fixtureOptions),
            expected,
        );
    }
});

test("registry invokes the central accent and deck configuration validation", async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-registry-"));
    try {
        await mkdir(path.join(temporaryRoot, "course"));
        const entry = path.join(temporaryRoot, "course", "w01.md");
        const registry = {
            presentations: [
                {
                    id: "w01",
                    title: "Week 1",
                    summary: "Configuration validation fixture.",
                    entry: "course/w01.md",
                    topics: ["configuration"],
                },
            ],
            resources: [],
        };
        await writeFile(
            entry,
            "---\ntheme: it230\nrouterMode: hash\nthemeConfig:\n  it230Accent: brown\n---\n\n# Invalid\n",
        );
        await assert.rejects(
            validateRegistry(registry, { root: temporaryRoot }),
            /Invalid themeConfig\.it230Accent/,
        );

        await writeFile(
            entry,
            "---\ntheme: default\nrouterMode: hash\n---\n\n# Invalid\n",
        );
        await assert.rejects(
            validateRegistry(registry, { root: temporaryRoot }),
            /theme: it230/,
        );

        await writeFile(
            entry,
            "---\ntheme: it230\nrouterMode: history\n---\n\n# Invalid\n",
        );
        await assert.rejects(
            validateRegistry(registry, { root: temporaryRoot }),
            /routerMode: hash/,
        );
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

test("site bases and derived presentation routes stay deployment-independent", () => {
    assert.equal(validateSiteBase("/"), "/");
    assert.equal(validateSiteBase("/SCC-IT-230/"), "/SCC-IT-230/");
    assert.equal(presentationRoute("w01"), "/w01/");
    assert.equal(withSiteBase("/", presentationRoute("w01")), "/w01/");
    assert.equal(
        withSiteBase("/SCC-IT-230/", presentationRoute("w01")),
        "/SCC-IT-230/w01/",
    );
    for (const invalid of ["", "repo/", "/repo", "/../", "/repo/?x=1"])
        assert.throws(() => validateSiteBase(invalid));
});

test("supported identifiers distinguish weeks and durable topics", () => {
    for (const valid of [
        "w01",
        "w16",
        "it230-shell",
        "rh124-files",
        "rh134-storage",
    ])
        assert.equal(isSupportedPresentationId(valid), true);
    for (const invalid of ["w00", "w17", "week-1", "shell", "RH134-storage"])
        assert.equal(isSupportedPresentationId(invalid), false);
});

test("landing-page template omits empty sections and renders registry materials", async () => {
    const empty = await renderLandingPage(
        { presentations: [], resources: [] },
        "/",
    );
    assert.doesNotMatch(empty, /material-card/);
    assert.doesNotMatch(empty, /publication-status/);
    assert.match(empty, /href="\.\/site\.css"/);

    assert.match(empty, /<main id="main-content">/);
    assert.match(empty, /Skip to course information/);

    const populated = await renderLandingPage(fixtureRegistry, "/project/");
    assert.match(populated, /href="\.\/site\.css"/);
    assert.match(populated, /href="\/project\/it230-integration\/"/);
    assert.match(
        populated,
        /href="\/project\/resources\/integration-resource\.txt"/,
    );
    assert.doesNotMatch(populated, /publication-status/);
    assert.doesNotMatch(populated, /IT230_[A-Z_]+/);
});

test("landing-page development reloads validated registry changes", async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-dev-"));
    const registryPath = path.join(temporaryRoot, "slides.config.mjs");
    let development;
    try {
        await writeLandingDevRegistry(registryPath, "Initial title");
        development = await createLandingPageDevServer({
            registryPath,
            root,
            registryOptions: { courseRoot: "tests/fixtures/course" },
        });
        await new Promise((resolve, reject) => {
            development.server.once("error", reject);
            development.server.listen(0, "localhost", resolve);
        });
        const address = development.server.address();
        assert.equal(typeof address, "object");
        const origin = `http://localhost:${address.port}`;

        const initial = await fetch(origin).then((response) => response.text());
        assert.match(initial, /Initial title/);
        assert.match(initial, /__it230_reload/);

        const events = await fetch(`${origin}/__it230_reload`);
        const reader = events.body.getReader();
        await readWithTimeout(reader);
        await writeLandingDevRegistry(registryPath, "Updated title");
        const reload = await readWithTimeout(reader);
        assert.match(new TextDecoder().decode(reload.value), /data: reload/);

        const updated = await fetch(origin).then((response) => response.text());
        assert.match(updated, /Updated title/);
        await reader.cancel();
    } finally {
        if (development) {
            development.dispose();
            if (development.server.listening)
                await new Promise((resolve, reject) =>
                    development.server.close((error) =>
                        error ? reject(error) : resolve(),
                    ),
                );
        }
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

test("build outputs reject paths outside the generated root", () => {
    const unsafe = {
        presentations: [{ id: "../outside" }],
        resources: [],
    };
    assert.throws(
        () => validateBuildOutputs(unsafe, path.join(root, "dist")),
        /must remain inside/,
    );
});

test("generated-root cleanup refuses symbolic links", async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-output-"));
    try {
        const generated = path.join(temporaryRoot, "dist");
        await symlink(tmpdir(), generated);
        await assert.rejects(
            assertSafeGeneratedRoot(generated, temporaryRoot),
            /symbolic-link generated root/,
        );
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

test("focused command argument contracts are strict and registry-driven", () => {
    assert.deepEqual(userArguments(["--", "w01"]), ["w01"]);
    assert.deepEqual(userArguments(["w01"]), ["w01"]);
    assert.doesNotThrow(() => requireNoArguments([], "Preview"));
    assert.throws(
        () => requireNoArguments(["w01"], "Preview"),
        /does not accept/,
    );
    assert.equal(requireOneId(["w01"], "Build"), "w01");
    assert.throws(() => requireOneId([], "Build"), /exactly one/);
    assert.throws(() => requireOneId(["w01", "w02"], "Build"), /exactly one/);
    assert.throws(
        () =>
            selectRegisteredPresentation({ presentations: [] }, "w01", "Build"),
        /unknown deck ID/,
    );
});

test("focused entries remain canonical Markdown decks beneath the configured course root", async () => {
    const options = { courseRoot: "tests/fixtures/course" };
    await assert.doesNotReject(
        validateFocusedEntry(root, "tests/fixtures/course/example.md", options),
    );
    for (const entry of [
        "/tmp/example.md",
        "tests/fixtures/course/../site/resource.txt",
        "tests/fixtures/course/public/assets/integration-diagram.svg",
        "tests/fixtures/course/fragments/named-fragment.md",
    ])
        await assert.rejects(validateFocusedEntry(root, entry, options));
});

test("reserved port validation rejects an occupied localhost port", async () => {
    const server = net.createServer();
    try {
        await new Promise((resolve, reject) => {
            server.once("error", reject);
            server.listen(0, "localhost", resolve);
        });
        await assert.rejects(
            assertPortAvailable(server.address().port),
            /is occupied/,
        );
    } finally {
        await new Promise((resolve, reject) =>
            server.close((error) => (error ? reject(error) : resolve())),
        );
    }
});

test("generated link checker reports missing internal files", async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-links-"));
    try {
        await writeFile(
            path.join(temporaryRoot, "index.html"),
            '<link rel="stylesheet" href="/site.css"><a href="/missing/">Missing</a>',
        );
        await writeFile(path.join(temporaryRoot, "site.css"), "body {}\n");
        await assert.rejects(
            checkGeneratedSite({
                distRoot: temporaryRoot,
                registry: { presentations: [], resources: [] },
            }),
            /missing generated file/,
        );
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

function cloneFixture() {
    return structuredClone(fixtureRegistry);
}

async function writeLandingDevRegistry(file, title) {
    const registry = {
        presentations: [
            {
                id: "it230-integration",
                title,
                summary: "Live-reload integration fixture.",
                entry: "tests/fixtures/course/example.md",
                topics: ["live reload"],
            },
        ],
        resources: [],
    };
    await writeFile(file, `export default ${JSON.stringify(registry)};\n`);
}

async function readWithTimeout(reader) {
    let timeout;
    try {
        return await Promise.race([
            reader.read(),
            new Promise((_, reject) => {
                timeout = setTimeout(
                    () =>
                        reject(new Error("Timed out waiting for live reload.")),
                    3_000,
                );
            }),
        ]);
    } finally {
        clearTimeout(timeout);
    }
}
