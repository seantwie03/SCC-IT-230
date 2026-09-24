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

/**
 * How many week builds or PDF exports run at once.
 *
 * Four keeps a build busy without letting a long course decide how much of the
 * machine it takes.
 */
const BUILD_CONCURRENCY = 4;

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

    await withLimit(catalog.presentations, (presentation) =>
        onceMore(`${presentation.id} slides`, async () => {
            const output = outputs.presentations.get(presentation.id);
            await preparePresentationOutput(output);
            await buildPresentationSlides({
                presentation,
                root: absoluteRoot,
                output,
                siteBase: base,
            });
        }),
    );

    /*
     * Exports run alongside each other again.
     *
     * They were serialized because parallel exports failed intermittently.
     * The cause was not the export itself: every Slidev process, build and
     * export alike, rewrote the same generated import-glob modules under the
     * course directory, and a process could read one while another was partway
     * through replacing it. The pinned Slidev patch makes that replacement
     * atomic, so the exports no longer collide and the serial pass, which was
     * most of a build's wall time, is gone.
     */
    await withLimit(catalog.presentations, (presentation) =>
        onceMore(`${presentation.id} PDF`, () =>
            exportPresentationPdf({
                presentation,
                root: absoluteRoot,
                output: outputs.presentations.get(presentation.id),
            }),
        ),
    );

    return { distRoot: absoluteDist, siteBase: base };
}

/**
 * Run one week's task, and once more if the first attempt fails.
 *
 * Slidev processes share generated state beyond the pinned patch's reach: Vite
 * pre-bundles this project's dependencies into one directory inside the Slidev
 * package, and processes starting together while that is cold have been seen to
 * collide there. Nothing about the material is wrong in that case, and the
 * second attempt finds the work already done.
 *
 * A retry is announced rather than absorbed. A real failure in the material
 * fails twice and still stops the build; a collision shows up in the log as
 * something that happened once.
 */
async function onceMore(label, task) {
    try {
        return await task();
    } catch (error) {
        console.warn(`${label} failed, retrying once: ${error.message}`);
        return await task();
    }
}

/**
 * Run a task for every week, a few weeks at a time.
 *
 * Each task is a Slidev process: a complete Vite build or a headless browser
 * export. The ceiling is memory rather than cores, so a sixteen-week course
 * must not start sixteen of them at once, and a course of any length should
 * not depend on how many weeks it happens to have.
 */
async function withLimit(items, run, limit = BUILD_CONCURRENCY) {
    const queue = [...items];
    const workers = Array.from(
        { length: Math.min(limit, queue.length) },
        async () => {
            while (queue.length > 0) await run(queue.shift());
        },
    );
    await Promise.all(workers);
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
