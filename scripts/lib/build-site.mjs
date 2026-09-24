import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_PUBLIC_ORIGIN } from "./config.mjs";
import {
    assertContained,
    assertSafeGeneratedRoot,
    canvasAuthoringRoute,
    presentationPdfFilename,
    presentationRoute,
    showcaseRoute,
    weekOverviewRoute,
    validateSiteBase,
    withSiteBase,
} from "./paths.mjs";
import { run } from "./process.mjs";
import {
    buildShowcasePreviews,
    resolveShowcaseSlots,
} from "./showcase-previews.mjs";
import { renderPublishedArtifacts } from "./site-artifacts.mjs";

export async function buildPublishedSite({
    catalog,
    root,
    distRoot,
    safetyRoot = root,
    siteBase = "/",
    publicOrigin = DEFAULT_PUBLIC_ORIGIN,
    /*
     * Which showcase slots this build requires. A parameter with no default,
     * because only a build of the published course knows it should have them:
     * the fixture week and the malformed-catalog tests carry none and must
     * still reach the failure they are checking for.
     */
    showcaseSlotAliases = [],
}) {
    const absoluteRoot = path.resolve(root);
    const absoluteDist = await assertSafeGeneratedRoot(distRoot, safetyRoot);
    const base = validateSiteBase(siteBase);
    const outputs = validateBuildOutputs(catalog, absoluteDist);
    /*
     * Build the showcase's slide bundle before the output directory is
     * recreated, so a failure leaves the previous build intact rather than a
     * half-written site. The bundle is content addressed, so a build whose
     * featured slides have not changed reuses the previous one.
     */
    const showcaseSlots = resolveShowcaseSlots(catalog, showcaseSlotAliases);
    const previews = await buildShowcasePreviews({
        root: absoluteRoot,
        siteBase: base,
        slots: showcaseSlots,
    });
    const artifacts = await renderPublishedArtifacts({
        catalog,
        publicOrigin,
        showcase: { slots: showcaseSlots },
        siteBase: base,
    });

    await rm(absoluteDist, { force: true, recursive: true });
    await mkdir(absoluteDist, { recursive: true });
    await Promise.all([
        writeFile(path.join(absoluteDist, "favicon.svg"), artifacts.favicon),
        writeFile(path.join(absoluteDist, "index.html"), artifacts.landingPage),
        writeFile(path.join(absoluteDist, "site.css"), artifacts.styles),
        mkdir(outputs.showcaseAssets, { recursive: true }).then(() =>
            Promise.all([
                writeFile(
                    path.join(outputs.showcase, "index.html"),
                    artifacts.showcasePage,
                ),
                writeFile(
                    path.join(outputs.showcaseAssets, "showcase.css"),
                    artifacts.showcaseStyles,
                ),
                writeFile(
                    path.join(outputs.showcaseAssets, "showcase.mjs"),
                    artifacts.showcaseScript,
                ),
            ]),
        ),
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

    /*
     * Publish the showcase's slide bundle. It is copied rather than rebuilt
     * into place so the content-addressed cache survives between builds.
     */
    if (previews.directory)
        await cp(previews.directory, outputs.showcasePreviews, {
            recursive: true,
        });

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
    const showcase = path.resolve(distRoot, showcaseRoute().slice(1));
    const showcaseAssets = path.join(showcase, "assets");
    const showcasePreviews = path.join(showcase, "previews");
    assertContained(distRoot, showcase, "showcase output");
    assertContained(showcase, showcaseAssets, "showcase asset output");
    assertContained(showcase, showcasePreviews, "showcase preview output");

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

    return {
        presentations,
        showcase,
        showcaseAssets,
        showcasePreviews,
    };
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
