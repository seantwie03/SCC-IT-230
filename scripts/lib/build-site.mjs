import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_PUBLIC_ORIGIN } from "./config.mjs";
import {
    assertContained,
    assertSafeGeneratedRoot,
    canvasAuthoringRoute,
    presentationPdfFilename,
    presentationRoute,
    weekOverviewRoute,
    validateSiteBase,
    withSiteBase,
} from "./paths.mjs";
import { run } from "./process.mjs";
import { renderPublishedArtifacts } from "./site-artifacts.mjs";

export async function buildPublishedSite({
    catalog,
    root,
    distRoot,
    safetyRoot = root,
    siteBase = "/",
    publicOrigin = DEFAULT_PUBLIC_ORIGIN,
}) {
    const absoluteRoot = path.resolve(root);
    const absoluteDist = await assertSafeGeneratedRoot(distRoot, safetyRoot);
    const base = validateSiteBase(siteBase);
    const outputs = validateBuildOutputs(catalog, absoluteDist);
    const artifacts = await renderPublishedArtifacts({
        catalog,
        siteBase: base,
        publicOrigin,
    });

    await rm(absoluteDist, { force: true, recursive: true });
    await mkdir(absoluteDist, { recursive: true });
    await Promise.all([
        writeFile(path.join(absoluteDist, "favicon.svg"), artifacts.favicon),
        writeFile(path.join(absoluteDist, "index.html"), artifacts.landingPage),
        writeFile(path.join(absoluteDist, "site.css"), artifacts.styles),
        ...catalog.presentations.map((presentation, index) => {
            const output = outputs.presentations.get(presentation.id);
            const week = artifacts.weeks[index];
            return Promise.all([
                mkdir(output.week, { recursive: true }).then(() =>
                    writeFile(path.join(output.week, "index.html"), week.page),
                ),
                mkdir(output.canvas, { recursive: true }).then(() =>
                    writeFile(
                        path.join(output.canvas, "index.html"),
                        week.canvasPage,
                    ),
                ),
                mkdir(output.resources, { recursive: true }).then(() =>
                    Promise.all(
                        week.resources.map((resource) =>
                            writeFile(
                                path.join(output.resources, resource.filename),
                                resource.html,
                            ),
                        ),
                    ),
                ),
            ]);
        }),
    ]);

    await Promise.all(
        catalog.presentations.map(async (presentation) => {
            const output = outputs.presentations.get(presentation.id);
            await preparePresentationOutput(output);
            return buildPresentationSlides({
                presentation,
                root: absoluteRoot,
                output,
                siteBase: base,
            });
        }),
    );

    for (const presentation of catalog.presentations) {
        await exportPresentationPdf({
            presentation,
            root: absoluteRoot,
            output: outputs.presentations.get(presentation.id),
        });
    }

    return { distRoot: absoluteDist, siteBase: base };
}

export function validateBuildOutputs(catalog, distRoot) {
    const presentations = new Map();

    for (const presentation of catalog.presentations) {
        const week = path.resolve(
            distRoot,
            weekOverviewRoute(presentation.id).slice(1),
        );
        const slides = path.join(week, "slides");
        const resources = path.join(week, "resources");
        const canvas = path.resolve(
            distRoot,
            canvasAuthoringRoute(presentation.id).slice(1),
        );
        assertContained(distRoot, week, `week output for ${presentation.id}`);
        assertContained(week, slides, `slide output for ${presentation.id}`);
        assertContained(
            week,
            resources,
            `resource output for ${presentation.id}`,
        );
        assertContained(
            week,
            canvas,
            `Canvas authoring output for ${presentation.id}`,
        );
        presentations.set(
            presentation.id,
            Object.freeze({ week, slides, resources, canvas }),
        );
    }

    return { presentations };
}

export async function buildPresentation({
    presentation,
    root,
    output,
    siteBase = "/",
}) {
    await preparePresentationOutput(output);

    await Promise.all([
        buildPresentationSlides({ presentation, root, output, siteBase }),
        exportPresentationPdf({ presentation, root, output }),
    ]);
}

async function preparePresentationOutput(output) {
    await Promise.all([
        mkdir(output.week, { recursive: true }),
        mkdir(output.resources, { recursive: true }),
    ]);
}

async function buildPresentationSlides({
    presentation,
    root,
    output,
    siteBase,
}) {
    const base = validateSiteBase(siteBase);
    await run(
        "slidev",
        [
            "build",
            presentation.entryAbsolute,
            "--out",
            output.slides,
            "--base",
            withSiteBase(base, presentationRoute(presentation.id)),
            "--without-notes",
        ],
        { cwd: root },
    );
}

async function exportPresentationPdf({ presentation, root, output }) {
    await run(
        "slidev",
        [
            "export",
            presentation.entryAbsolute,
            "--output",
            path.join(
                output.resources,
                presentationPdfFilename(presentation.id),
            ),
        ],
        { cwd: root },
    );
}
