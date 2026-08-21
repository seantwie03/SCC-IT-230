import assert from "node:assert/strict";
import {
    mkdtemp,
    mkdir,
    readFile,
    rename,
    rm,
    symlink,
    writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import net from "node:net";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
    requireNoArguments,
    requireOneId,
    selectPublishedWeek,
    userArguments,
    validateFocusedEntry,
} from "../scripts/lib/arguments.mjs";
import {
    buildPublishedSite,
    validateBuildOutputs,
} from "../scripts/lib/build-site.mjs";
import {
    createCourseSiteDevServer,
    renderInFreshWorker,
} from "../scripts/lib/development.mjs";
import { renderExerciseResource } from "../scripts/lib/exercise-resource.mjs";
import { checkGeneratedSite } from "../scripts/lib/links.mjs";
import {
    assertSafeGeneratedRoot,
    canvasAuthoringRoute,
    presentationPdfFilename,
    presentationResourceRoute,
    presentationRoute,
    validateSiteBase,
    weekOverviewRoute,
    withSiteBase,
} from "../scripts/lib/paths.mjs";
import {
    discoverCanonicalWeeks,
    isCanonicalWeekId,
    loadPresentationCatalog,
} from "../scripts/lib/presentations.mjs";
import {
    buildWeeklyView,
    validatePublicOrigin,
} from "../scripts/lib/weekly-view.mjs";
import { assertPortAvailable } from "../scripts/lib/server.mjs";
import { renderCanvasFragment } from "../site/render-canvas.mjs";
import {
    renderCanvasAuthoringPage,
    renderLandingPage,
    renderSiteStyles,
    renderWeekPage,
    renderWeeklyOverview,
} from "../site/render-template.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixtureOptions = { root, courseRoot: "tests/fixtures/course" };

test("production metadata publishes Week 01 with reviewed agenda and curriculum", async () => {
    const catalog = await loadPresentationCatalog({ root });
    assert.deepEqual(
        catalog.presentations.map(({ id }) => id),
        ["w01"],
    );
    const [week] = catalog.presentations;
    assert.equal(
        week.accentCssVariables["--it230-color-accent-fill"],
        "#2190A4",
    );
    assert.deepEqual(
        week.agenda.map(({ title, routeAlias }) => ({ title, routeAlias })),
        [
            { title: "Course Introduction", routeAlias: "course-introduction" },
            {
                title: "Accessing the Lab Environments",
                routeAlias: "lab-environments",
            },
            { title: "Bash Prompt", routeAlias: "bash-prompt" },
            { title: "Output Redirection", routeAlias: "output-redirection" },
            { title: "Pipe Operator", routeAlias: "pipe-operator" },
            { title: "Sudo", routeAlias: "sudo" },
        ],
    );
    assert.deepEqual(
        week.academyChapters.map(
            ({ course, chapter }) => `${course}:${chapter}`,
        ),
        ["RH124:02", "RH124:09", "RH124:10", "RH134:00"],
    );
    assert.deepEqual(
        week.certGuideChapters.map(({ chapter }) => chapter),
        ["02", "06"],
    );
    assert.equal(
        week.resources[0].filename,
        "output-redirection-exercise.html",
    );
    assert.equal(Object.hasOwn(week.resources[0], "summary"), false);
    assert.equal(Object.isFrozen(week.agenda), true);
});

test("fixture discovery derives IDs, ignores drafts, and resolves topic resources", async () => {
    const catalog = await loadPresentationCatalog(fixtureOptions);
    assert.deepEqual(
        catalog.presentations.map(({ id }) => id),
        ["w16"],
    );
    const [week] = catalog.presentations;
    assert.match(week.entryAbsolute, /w16\.md$/);
    assert.equal(
        week.accentCssVariables["--it230-color-accent-fill"],
        "#9141AC",
    );
    assert.equal(week.agenda[0].routeAlias, "named-fragment");
    assert.equal(week.resources[0].filename, "integration-exercise.html");
    assert.match(
        week.resources[0].sourceAbsolute,
        /integration-exercise\.html$/,
    );
});

test("canonical week discovery sorts weeks and rejects non-files", async () => {
    const temporaryRoot = await mkdtemp(
        path.join(tmpdir(), "it230-discovery-"),
    );
    try {
        await Promise.all([
            writeFile(path.join(temporaryRoot, "w16.md"), ""),
            writeFile(path.join(temporaryRoot, "w01.md"), ""),
            writeFile(path.join(temporaryRoot, "w02-draft.md"), ""),
            writeFile(path.join(temporaryRoot, "w00.md"), ""),
        ]);
        assert.deepEqual(
            (await discoverCanonicalWeeks(temporaryRoot)).map((entry) =>
                path.basename(entry),
            ),
            ["w01.md", "w16.md"],
        );
        await rm(path.join(temporaryRoot, "w01.md"));
        await mkdir(path.join(temporaryRoot, "w01.md"));
        await assert.rejects(
            discoverCanonicalWeeks(temporaryRoot),
            /must be a regular file/,
        );
        await rm(path.join(temporaryRoot, "w01.md"), {
            recursive: true,
        });
        await symlink("w16.md", path.join(temporaryRoot, "w03.md"));
        await assert.rejects(
            discoverCanonicalWeeks(temporaryRoot),
            /w03\.md cannot be a symlink/,
        );
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

test("catalog reports strict metadata and parser failures", async () => {
    const temporaryRoot = await createTemporaryCourse();
    try {
        await assert.rejects(
            loadPresentationCatalog({ root: temporaryRoot }),
            /courseInfo.*summary/,
        );
        await writeMinimalWeek(temporaryRoot, {
            summary: "Fixture summary.",
            importPath: "./chapters/missing.md",
        });
        await assert.rejects(
            loadPresentationCatalog({ root: temporaryRoot }),
            /parser errors[\s\S]*not found/,
        );
        await writeMinimalWeek(temporaryRoot, { summary: "Fixture summary." });
        await writeFile(
            path.join(temporaryRoot, "course", "chapters", "topic.md"),
            topicSource({ routeAlias: "Bad Alias" }),
        );
        await assert.rejects(
            loadPresentationCatalog({ root: temporaryRoot }),
            /routeAlias/,
        );
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

test("site bases and derived presentation routes stay deployment-independent", () => {
    assert.equal(validateSiteBase("/"), "/");
    assert.equal(validateSiteBase("/SCC-IT-230/"), "/SCC-IT-230/");
    assert.equal(weekOverviewRoute("w01"), "/weeks/w01/");
    assert.equal(canvasAuthoringRoute("w01"), "/weeks/w01/canvas/");
    assert.equal(presentationRoute("w01"), "/weeks/w01/slides/");
    assert.equal(presentationPdfFilename("w01"), "SCC-IT-230-w01.pdf");
    assert.equal(
        presentationResourceRoute("w01", "SCC-IT-230-w01.pdf"),
        "/weeks/w01/resources/SCC-IT-230-w01.pdf",
    );
    assert.equal(
        withSiteBase("/", presentationRoute("w01")),
        "/weeks/w01/slides/",
    );
    assert.equal(
        withSiteBase("/SCC-IT-230/", presentationRoute("w01")),
        "/SCC-IT-230/weeks/w01/slides/",
    );
    for (const invalid of ["", "repo/", "/repo", "/../", "/repo/?x=1"])
        assert.throws(() => validateSiteBase(invalid));
});

test("public origin validation accepts only a plain HTTPS origin", () => {
    assert.equal(
        validatePublicOrigin("https://it230.example"),
        "https://it230.example",
    );
    for (const invalid of [
        "http://it230.example",
        "https://user@it230.example",
        "https://it230.example/course",
        "https://it230.example/?query=1",
        "not a url",
    ])
        assert.throws(() => validatePublicOrigin(invalid));
});

test("exercise resources inherit the publishing week's accent", () => {
    const source =
        "<!doctype html><html><head><style>:root { --it230-color-accent-fill: #3584e4; }</style></head><body></body></html>";
    const rendered = renderExerciseResource(source, {
        "--it230-color-accent-fill": "#9141AC",
        "--it230-color-accent-text": "#8939A4",
        "--it230-color-accent-wash": "rgb(145 65 172 / 14%)",
    });
    assert.match(rendered, /data-it230-week-accent/);
    assert.ok(rendered.lastIndexOf("#9141AC") > rendered.indexOf("#3584e4"));
    assert.throws(
        () => renderExerciseResource("<html></html>", {}),
        /missing --it230-color-accent-fill|closing head/,
    );
});

test("exercise validation rejects malformed HTML before generated output is removed", async () => {
    const catalog = await loadPresentationCatalog(fixtureOptions);
    const [presentation] = catalog.presentations;
    const malformedCatalog = {
        presentations: [
            {
                ...presentation,
                resources: presentation.resources.map((resource) => ({
                    ...resource,
                    htmlSource: "<html><body>Malformed exercise</body></html>",
                })),
            },
        ],
    };
    const temporaryRoot = await mkdtemp(
        path.join(tmpdir(), "it230-preflight-"),
    );
    const output = path.join(temporaryRoot, "dist");
    const sentinel = path.join(output, "previous-build.txt");
    try {
        await mkdir(output);
        await writeFile(sentinel, "previous build");
        await assert.rejects(
            buildPublishedSite({
                catalog: malformedCatalog,
                root,
                distRoot: output,
                safetyRoot: temporaryRoot,
            }),
            /closing head element/,
        );
        assert.equal(await fileText(sentinel), "previous build");
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

test("exercise metadata rejects escapes, symlinks, PDF collisions, and basename collisions", async () => {
    const temporaryRoot = await mkdtemp(
        path.join(tmpdir(), "it230-exercise-safety-"),
    );
    try {
        await writeCourseWithTopics(temporaryRoot, [
            {
                name: "escape",
                exerciseSource: "../outside-exercise.html",
            },
        ]);
        await assert.rejects(
            loadPresentationCatalog({ root: temporaryRoot }),
            /must remain inside/,
        );

        await writeCourseWithTopics(temporaryRoot, [
            {
                name: "pdf",
                exerciseSource: "./exercises/SCC-IT-230-w01.pdf",
            },
        ]);
        await assert.rejects(
            loadPresentationCatalog({ root: temporaryRoot }),
            /collides with the generated PDF filename/,
        );

        await writeCourseWithTopics(temporaryRoot, [
            {
                name: "linked",
                exerciseSource: "./exercises/linked-exercise.html",
            },
        ]);
        const linkedRoot = path.join(
            temporaryRoot,
            "course",
            "chapters",
            "linked",
            "exercises",
        );
        await writeFile(
            path.join(linkedRoot, "target-exercise.html"),
            exerciseDocument("Target"),
        );
        await symlink(
            "target-exercise.html",
            path.join(linkedRoot, "linked-exercise.html"),
        );
        await assert.rejects(
            loadPresentationCatalog({ root: temporaryRoot }),
            /source cannot be a symlink/,
        );

        await writeCourseWithTopics(temporaryRoot, [
            {
                name: "first",
                exerciseSource: "./exercises/shared-exercise.html",
                exerciseHtml: exerciseDocument("First"),
            },
            {
                name: "second",
                exerciseSource: "./exercises/shared-exercise.html",
                exerciseHtml: exerciseDocument("Second"),
            },
        ]);
        await assert.rejects(
            loadPresentationCatalog({ root: temporaryRoot }),
            /filename shared-exercise\.html collides/,
        );
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

test("weekly view owns shared instructional text and absolute destinations", async () => {
    const [presentation] = (await loadPresentationCatalog(fixtureOptions))
        .presentations;
    const view = buildWeeklyView(presentation, {
        siteBase: "/project/",
        publicOrigin: "https://it230.example",
    });
    assert.deepEqual(
        view.beforeClass.items.map(({ text }) => text),
        ["RH124, Chapter 09: Redirecting Shell Output"],
    );
    assert.deepEqual(
        view.optionalReading.items.map(({ text }) => text),
        ["Chapter 02: Using Essential Tools"],
    );
    assert.equal(
        view.inClass.presentationAction.href,
        "https://it230.example/project/weeks/w16/slides/",
    );
    assert.equal(
        view.inClass.topics[0].href,
        "https://it230.example/project/weeks/w16/slides/#/named-fragment",
    );
    assert.equal(
        view.inClass.topics[0].exercises[0].text,
        "Integration Exercise",
    );
    assert.equal(
        view.labs.body,
        "Complete the lab assignments in this week’s Canvas module.",
    );
});

test("site and Canvas weekly links retain ordered text and destinations", async () => {
    const [presentation] = (await loadPresentationCatalog(fixtureOptions))
        .presentations;
    const siteView = buildWeeklyView(presentation, {
        siteBase: "/project/",
    });
    const canvasView = buildWeeklyView(presentation, {
        siteBase: "/project/",
        publicOrigin: "https://it230.example",
    });
    const site = renderWeeklyOverview(siteView, {
        allWeeksHref: "/project/",
    }).match(/<article\b[\s\S]*?<\/article>/)?.[0];
    assert.ok(site);
    const siteLinks = extractLinkPairs(site);
    const canvasLinks = extractLinkPairs(renderCanvasFragment(canvasView)).map(
        ({ text, href }) => ({
            text,
            href: href.replace("https://it230.example", ""),
        }),
    );
    assert.deepEqual(canvasLinks, siteLinks);
});

test("landing page stays compact and links to the weekly detail page", async () => {
    const catalog = await loadPresentationCatalog(fixtureOptions);
    const html = await renderLandingPage(catalog, "/project/");
    assert.match(html, /class="week-summary-card"/);
    assert.match(html, /href="\/project\/weeks\/w16\/"/);
    assert.match(html, /View Week 16/);
    assert.doesNotMatch(html, /Meeting Agenda/);
    assert.doesNotMatch(html, /Integration Exercise/);
    assert.match(html, /--it230-color-accent-fill: #9141AC/);
    const styles = await renderSiteStyles();
    assert.match(styles, /^:root \{[\s\S]*#3584E4/);
    assert.match(
        styles,
        /main\s*\{[^}]*padding-block: clamp\(2\.1rem, 5\.6vw, 3\.85rem\)/s,
    );
    assert.match(
        styles,
        /section \+ section\s*\{[^}]*margin-top: clamp\(2\.1rem, 4\.9vw, 3\.5rem\)/s,
    );
    assert.doesNotMatch(styles, /\.week-page\s*\{[^}]*width:/s);
    assert.doesNotMatch(styles, /\.about\s*\{[^}]*max-width:/s);
});

test("weekly detail page is vertical, linked home, and navigates published weeks", async () => {
    const fixture = await loadPresentationCatalog(fixtureOptions);
    const source = fixture.presentations[0];
    const catalog = {
        presentations: [
            { ...source, id: "w01", title: "Week 01 — First" },
            { ...source, id: "w08", title: "Week 08 — Middle" },
            { ...source, id: "w16", title: "Week 16 — Last" },
        ],
    };
    const html = await renderWeekPage(catalog, 1, "/project/");
    assert.match(html, /class="week-overview"/);
    assert.match(html, /<h1 id="w08-title">Week 08/);
    assert.match(html, /<h2 id="w08-agenda">Meeting Agenda<\/h2>/);
    assert.match(html, /<h2 id="w08-labs">Lab Assignments<\/h2>/);
    assert.match(html, /this week’s Canvas module/);
    assert.match(
        html,
        /<h3><a[^>]*target="_blank"[^>]*>Named Fragment<\/a><\/h3>/,
    );
    assert.match(
        html,
        /href="\/project\/weeks\/w08\/slides\/#\/named-fragment"/,
    );
    assert.doesNotMatch(html, />Slides<\/a>/);
    assert.match(
        html,
        /class="primary-action"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/,
    );
    assert.match(html, />Integration Exercise<\/a><\/li>/);
    assert.doesNotMatch(html, /Start the Integration Exercise exercise/);
    assert.match(html, /href="\/project\/"[^>]*>IT-230<\/a>/);
    assert.match(html, /Previous week: Week 01 — First/);
    assert.match(html, /href="\/project\/weeks\/w16\/"/);
    assert.match(html, /Next week: Week 16 — Last/);
    assert.ok(
        html.indexOf("Before class") < html.indexOf("In class") &&
            html.indexOf("In class") < html.indexOf("After class · Required") &&
            html.indexOf("After class · Required") <
                html.indexOf("After class · Optional"),
    );
});

test("Canvas fragment is absolute, semantic, and script-free", async () => {
    const [presentation] = (await loadPresentationCatalog(fixtureOptions))
        .presentations;
    const view = buildWeeklyView(presentation, {
        siteBase: "/project/",
        publicOrigin: "https://it230.example",
    });
    const html = renderCanvasFragment(view);
    assert.match(html, /<h2[^>]*>Week 16/);
    assert.match(html, /<h3[^>]*>Meeting Agenda<\/h3>/);
    assert.match(html, /<h3[^>]*>Lab Assignments<\/h3>/);
    assert.match(html, /After class · Required/);
    assert.match(
        html,
        /<h4[^>]*><a[^>]*target="_blank"[^>]*>Named Fragment<\/a><\/h4>/,
    );
    assert.doesNotMatch(html, />Slides<\/a>/);
    assert.match(
        html,
        /https:\/\/it230\.example\/project\/weeks\/w16\/slides\/#\/named-fragment/,
    );
    assert.doesNotMatch(html, /<(?:style|script)\b/i);
    assert.doesNotMatch(html, /\son[a-z]+=/i);
    assert.doesNotMatch(html, /href="\//);
    assert.throws(
        () =>
            renderCanvasFragment(
                buildWeeklyView(presentation, { siteBase: "/project/" }),
            ),
        /Canvas destination presentation must be an absolute HTTPS URL/,
    );
});

test("Canvas authoring page exposes exact copyable source without rendering it", async () => {
    const [presentation] = (await loadPresentationCatalog(fixtureOptions))
        .presentations;
    const view = buildWeeklyView(presentation, {
        siteBase: "/project/",
        publicOrigin: "https://it230.example",
    });
    const fragment = renderCanvasFragment(view);
    const html = await renderCanvasAuthoringPage(
        presentation,
        fragment,
        "/project/",
    );
    assert.match(html, /Canvas authoring utility/);
    assert.match(html, /id="copy-canvas-source"/);
    assert.match(html, /navigator\.clipboard\.writeText/);
    assert.match(html, /href="\/project\/"[^>]*>IT-230<\/a>/);
    const encodedSource = html.match(
        /<textarea[\s\S]*?>([\s\S]*?)<\/textarea>/,
    )?.[1];
    assert.ok(encodedSource);
    assert.match(encodedSource, /&lt;div/);
    assert.equal(decodeHtml(encodedSource), fragment);
    assert.doesNotMatch(encodedSource, /<h2\b/);
});

test(
    "course-site development reload survives atomic replacement and invalid edits",
    { timeout: 15_000 },
    async () => {
        const temporaryRoot = await mkdtemp(
            path.join(tmpdir(), "it230-development-"),
        );
        let development;
        let reloadObserver;
        let reportReloadError;
        const reloadError = new Promise((resolve) => {
            reportReloadError = resolve;
        });
        try {
            const implementationDirectories = [
                path.join(temporaryRoot, "scripts", "lib"),
                path.join(temporaryRoot, "site"),
                path.join(
                    temporaryRoot,
                    "packages",
                    "slidev-theme-it230",
                    "setup",
                ),
            ];
            await Promise.all(
                implementationDirectories.map((directory) =>
                    mkdir(directory, { recursive: true }),
                ),
            );
            const accentFile = path.join(
                implementationDirectories[2],
                "accent.ts",
            );
            await writeFile(accentFile, "// Initial palette fixture.\n");
            await writeCourseWithTopics(temporaryRoot, [
                {
                    name: "reload-topic",
                    exerciseSource: "./exercises/reload-exercise.html",
                    exerciseHtml: exerciseDocument("Initial exercise"),
                },
            ]);
            development = await createCourseSiteDevServer({
                root: temporaryRoot,
                siteBase: "/dev/",
                publicOrigin: "https://development.it230.example",
                onReloadError: reportReloadError,
            });
            await new Promise((resolve, reject) => {
                development.server.once("error", reject);
                development.server.listen(0, "127.0.0.1", resolve);
            });
            const address = development.server.address();
            const origin = `http://127.0.0.1:${address.port}`;
            const weekUrl = `${origin}/dev/weeks/w01/`;
            const canvasUrl = `${origin}/dev/weeks/w01/canvas/`;
            const resourceUrl = `${origin}/dev/weeks/w01/resources/reload-exercise.html`;
            reloadObserver = await observeReloads(`${origin}/__it230_reload`);
            assert.match(
                await fetch(canvasUrl).then((response) => response.text()),
                /https:\/\/development\.it230\.example\/dev\/weeks\/w01\/slides\//,
            );

            const weekFile = path.join(temporaryRoot, "course", "w01.md");
            await replaceFileAtomically(
                weekFile,
                (await fileText(weekFile)).replace(
                    "Fixture summary.",
                    "First atomic update.",
                ),
            );
            await eventuallyContains(weekUrl, "First atomic update.");
            await replaceFileAtomically(
                weekFile,
                (await fileText(weekFile)).replace(
                    "First atomic update.",
                    "Second atomic update.",
                ),
            );
            await eventuallyContains(weekUrl, "Second atomic update.");

            const exerciseFile = path.join(
                temporaryRoot,
                "course",
                "chapters",
                "reload-topic",
                "exercises",
                "reload-exercise.html",
            );
            await replaceFileAtomically(
                exerciseFile,
                exerciseDocument("Reloaded exercise"),
            );
            await eventuallyContains(resourceUrl, "Reloaded exercise");

            const accentReload = reloadObserver.next();
            await replaceFileAtomically(
                accentFile,
                "// Reloaded palette fixture.\n",
            );
            await Promise.race([
                accentReload,
                delay(5_000).then(() =>
                    assert.fail("Timed out waiting for the accent reload."),
                ),
            ]);

            await replaceFileAtomically(
                weekFile,
                (await fileText(weekFile)).replace(
                    "courseInfo:\n  summary: Second atomic update.",
                    "courseInfo: {}",
                ),
            );
            await Promise.race([
                reloadError,
                delay(5_000).then(() =>
                    assert.fail("Timed out waiting for the invalid reload."),
                ),
            ]);
            assert.match(
                await fetch(weekUrl).then((response) => response.text()),
                /Second atomic update\./,
            );
            await replaceFileAtomically(
                weekFile,
                (await fileText(weekFile)).replace(
                    "courseInfo: {}",
                    "courseInfo:\n  summary: Recovered update.",
                ),
            );
            await eventuallyContains(weekUrl, "Recovered update.");
        } finally {
            await reloadObserver?.close();
            development?.dispose();
            if (development?.server.listening)
                await new Promise((resolve, reject) =>
                    development.server.close((error) =>
                        error ? reject(error) : resolve(),
                    ),
                );
            await rm(temporaryRoot, { recursive: true, force: true });
        }
    },
);

test("course-site render workers time out and respond to cancellation", async () => {
    await assert.rejects(
        renderInFreshWorker(fixtureOptions, { timeoutMilliseconds: 1 }),
        /Course-site renderer timed out after 1 ms/,
    );
    const controller = new AbortController();
    const rendering = renderInFreshWorker(fixtureOptions, {
        signal: controller.signal,
    });
    controller.abort();
    await assert.rejects(rendering, {
        message: "Course-site rendering was cancelled.",
        name: "AbortError",
    });
});

test("focused command contracts require published week IDs but drafts remain reviewable", async () => {
    assert.deepEqual(userArguments(["--", "w01"]), ["w01"]);
    assert.doesNotThrow(() => requireNoArguments([], "Preview"));
    assert.equal(requireOneId(["w01"], "Build"), "w01");
    assert.throws(
        () => requireOneId(["it230-shell"], "Build"),
        /canonical week/,
    );
    assert.equal(isCanonicalWeekId("w16"), true);
    assert.equal(isCanonicalWeekId("w17"), false);
    assert.throws(
        () => selectPublishedWeek({ presentations: [] }, "w01", "Build"),
        /unpublished week/,
    );
    await assert.doesNotReject(
        validateFocusedEntry(root, "tests/fixtures/course/w02-draft.md", {
            courseRoot: "tests/fixtures/course",
        }),
    );
});

test("build output and generated-root safeguards reject escapes and symlinks", async () => {
    assert.throws(
        () =>
            validateBuildOutputs(
                { presentations: [{ id: "../../../outside" }] },
                path.join(root, "dist"),
            ),
        /must remain inside/,
    );
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
                catalog: { presentations: [] },
            }),
            /missing generated file/,
        );
    } finally {
        await rm(temporaryRoot, { recursive: true, force: true });
    }
});

async function createTemporaryCourse() {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-catalog-"));
    await mkdir(path.join(temporaryRoot, "course", "chapters", "exercises"), {
        recursive: true,
    });
    await writeMinimalWeek(temporaryRoot, {});
    await writeFile(
        path.join(temporaryRoot, "course", "chapters", "topic.md"),
        topicSource({}),
    );
    return temporaryRoot;
}

async function writeCourseWithTopics(temporaryRoot, topics) {
    const courseRoot = path.join(temporaryRoot, "course");
    await rm(courseRoot, { recursive: true, force: true });
    await mkdir(courseRoot, { recursive: true });
    const imports = [];
    for (const topic of topics) {
        const topicRoot = path.join(courseRoot, "chapters", topic.name);
        const exercisesRoot = path.join(topicRoot, "exercises");
        await mkdir(exercisesRoot, { recursive: true });
        await writeFile(
            path.join(topicRoot, "topic.md"),
            `---\nlayout: section\nrouteAlias: ${topic.name}\ntopicInfo:\n  exercises:\n    - title: ${topic.name} Exercise\n      source: ${topic.exerciseSource}\n---\n\n# ${topic.name}\n`,
        );
        if (topic.exerciseHtml !== undefined)
            await writeFile(
                path.join(
                    topicRoot,
                    topic.exerciseSource.replace("./exercises/", "exercises/"),
                ),
                topic.exerciseHtml,
            );
        imports.push(`---\nsrc: ./chapters/${topic.name}/topic.md\n---\n`);
    }
    await writeFile(
        path.join(courseRoot, "w01.md"),
        `---\ntheme: it230\nrouterMode: hash\ntitle: Week 01 — Fixture\ncourseInfo:\n  summary: Fixture summary.\n---\n\n# Fixture\n\n${imports.join("\n")}`,
    );
}

function exerciseDocument(title) {
    return `<!doctype html><html><head><title>${title}</title></head><body>${title}</body></html>`;
}

function extractLinkPairs(html) {
    return [
        ...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g),
    ].map(([, href, content]) => ({
        text: decodeHtml(content.replace(/<[^>]*>/g, "").trim()),
        href: decodeHtml(href),
    }));
}

async function fileText(file) {
    return readFile(file, "utf8");
}

async function replaceFileAtomically(file, content) {
    const replacement = `${file}.replacement`;
    await writeFile(replacement, content);
    await rename(replacement, file);
}

async function eventuallyContains(url, expected) {
    const deadline = Date.now() + 5_000;
    while (Date.now() < deadline) {
        const content = await fetch(url).then((response) => response.text());
        if (content.includes(expected)) return;
        await delay(50);
    }
    assert.fail(`Timed out waiting for ${url} to contain ${expected}.`);
}

async function observeReloads(url) {
    const controller = new AbortController();
    const response = await fetch(url, { signal: controller.signal });
    assert.equal(response.status, 200);
    assert.ok(response.body);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffered = "";
    return {
        async close() {
            controller.abort();
            await reader.cancel().catch(() => {});
        },
        async next() {
            while (!buffered.includes("data: reload\n\n")) {
                const { done, value } = await reader.read();
                if (done)
                    throw new Error(
                        "Course-site reload stream closed unexpectedly.",
                    );
                buffered += decoder.decode(value, { stream: true });
            }
            buffered = buffered.replace("data: reload\n\n", "");
        },
    };
}

function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function writeMinimalWeek(
    temporaryRoot,
    { summary, importPath = "./chapters/topic.md" },
) {
    const courseInfo = summary
        ? `courseInfo:\n  summary: ${summary}\n`
        : "courseInfo: {}\n";
    await writeFile(
        path.join(temporaryRoot, "course", "w01.md"),
        `---\ntheme: it230\nrouterMode: hash\ntitle: Week 01 — Fixture\n${courseInfo}---\n\n# Fixture\n\n---\nsrc: ${importPath}\n---\n`,
    );
}

function topicSource({ routeAlias = "fixture-topic" }) {
    return `---\nlayout: section\nrouteAlias: ${routeAlias}\ntopicInfo: {}\n---\n\n# Fixture Topic\n`;
}

function decodeHtml(value) {
    return value
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&quot;", '"')
        .replaceAll("&#039;", "'")
        .replaceAll("&amp;", "&");
}
