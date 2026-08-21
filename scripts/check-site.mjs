import {
    mkdir,
    mkdtemp,
    readFile,
    readdir,
    rm,
    stat,
    writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildPublishedSite } from "./lib/build-site.mjs";
import { checkGeneratedSite } from "./lib/links.mjs";
import { loadPresentationCatalog } from "./lib/presentations.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalog = await loadPresentationCatalog({
    root,
    courseRoot: "tests/fixtures/course",
});
const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-site-"));

try {
    for (const siteBase of ["/", "/SCC-IT-230/"]) {
        const name = siteBase === "/" ? "root" : "project";
        const output = path.join(temporaryRoot, name, "dist");
        await mkdir(output, { recursive: true });
        await writeFile(path.join(output, "stale.txt"), "stale");
        await buildPublishedSite({
            catalog,
            root,
            distRoot: output,
            safetyRoot: path.join(temporaryRoot, name),
            siteBase,
        });
        await checkGeneratedSite({ distRoot: output, catalog, siteBase });
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
    const favicon = await readFile(path.join(output, "favicon.svg"), "utf8");
    if (!favicon.includes('fill="#3584e4"'))
        throw new Error("Generated site omitted the blue favicon.");
    const landing = await readFile(path.join(output, "index.html"), "utf8");
    const expectedRoute = `${siteBase}weeks/w16/`;
    if (!landing.includes(`href="${expectedRoute}"`))
        throw new Error(
            `Landing page did not use expected route ${expectedRoute}.`,
        );
    if (!landing.includes('href="./site.css"'))
        throw new Error(
            "Landing page did not retain its relative stylesheet reference.",
        );
    if (landing.includes("Integration Exercise"))
        throw new Error("Landing page included week-detail content.");
    const detail = await readFile(
        path.join(output, "weeks", "w16", "index.html"),
        "utf8",
    );
    if (!detail.includes("Integration Exercise"))
        throw new Error("Week detail page omitted the topic-owned exercise.");
    const pdfRoute = `${siteBase}weeks/w16/resources/SCC-IT-230-w16.pdf`;
    if (!detail.includes(`href="${pdfRoute}"`))
        throw new Error(`Week detail page omitted the PDF route ${pdfRoute}.`);
    const canvasPage = await readFile(
        path.join(output, "weeks", "w16", "canvas", "index.html"),
        "utf8",
    );
    if (!canvasPage.includes("Canvas authoring utility"))
        throw new Error("Generated site omitted the Canvas authoring page.");
    if (!canvasPage.includes("&lt;div"))
        throw new Error("Canvas authoring page did not expose escaped HTML.");
    const canvasSlideUrl =
        "https://it230.systemsmetanow.tech" +
        `${siteBase}weeks/w16/slides/#/named-fragment`;
    if (!canvasPage.includes(canvasSlideUrl))
        throw new Error("Canvas source omitted its absolute presentation URL.");

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
            path.join(
                output,
                "weeks",
                "w16",
                "resources",
                "integration-exercise.html",
            ),
        ))
    )
        throw new Error("The week-owned exercise was not copied.");
    const exercise = await readFile(
        path.join(
            output,
            "weeks",
            "w16",
            "resources",
            "integration-exercise.html",
        ),
        "utf8",
    );
    if (!exercise.includes("IT230_EXERCISE_FIXTURE_SENTINEL"))
        throw new Error("The copied exercise did not contain its sentinel.");
    if (!exercise.includes('href="../../../favicon.svg"'))
        throw new Error("The generated exercise omitted the shared favicon.");
    if (
        !exercise.includes("data-it230-week-accent") ||
        !exercise.includes("#9141AC")
    )
        throw new Error("The generated exercise omitted its week accent.");
    const pdf = await readFile(
        path.join(output, "weeks", "w16", "resources", "SCC-IT-230-w16.pdf"),
    );
    if (pdf.subarray(0, 5).toString() !== "%PDF-")
        throw new Error("The generated presentation PDF is invalid.");
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
        return (await stat(file)).isFile();
    } catch {
        return false;
    }
}
