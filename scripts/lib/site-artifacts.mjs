import { readFile } from "node:fs/promises";

import {
    renderCanvasAuthoringPage,
    renderSiteFavicon,
    renderLandingPage,
    renderShowcasePage,
    renderShowcaseScript,
    renderShowcaseStyles,
    renderSiteStyles,
    renderWeekPage,
} from "../../site/render-template.mjs";
import { renderCanvasFragment } from "../../site/render-canvas.mjs";
import { DEFAULT_PUBLIC_ORIGIN, DEFAULT_SITE_BASE } from "./config.mjs";
import { renderExerciseResource } from "./exercise-resource.mjs";
import { validateSiteBase } from "./paths.mjs";
import { buildWeeklyView } from "./weekly-view.mjs";

export async function renderPublishedArtifacts({
    catalog,
    siteBase = DEFAULT_SITE_BASE,
    publicOrigin = DEFAULT_PUBLIC_ORIGIN,
    showcase = { slots: [] },
}) {
    const base = validateSiteBase(siteBase);
    const recordings = await countRecordings(catalog);
    const [
        favicon,
        styles,
        landingPage,
        showcasePage,
        showcaseStyles,
        showcaseScript,
        weeks,
    ] = await Promise.all([
        renderSiteFavicon(),
        renderSiteStyles(),
        renderLandingPage(catalog, base),
        renderShowcasePage(catalog, base, {
            recordings,
            slots: showcase.slots,
        }),
        renderShowcaseStyles(),
        renderShowcaseScript(),
        Promise.all(
            catalog.presentations.map(async (presentation, index) => {
                const canvasView = buildWeeklyView(presentation, {
                    siteBase: base,
                    publicOrigin,
                });
                return {
                    id: presentation.id,
                    page: await renderWeekPage(catalog, index, base),
                    canvasPage: await renderCanvasAuthoringPage(
                        presentation,
                        renderCanvasFragment(canvasView),
                        base,
                    ),
                    resources: renderPresentationResources(presentation),
                };
            }),
        ),
    ]);
    return {
        favicon,
        landingPage,
        showcasePage,
        showcaseScript,
        showcaseStyles,
        siteBase: base,
        styles,
        weeks,
    };
}

export function renderPresentationResources(presentation) {
    return presentation.resources.map((resource) => ({
        filename: resource.filename,
        html: renderExerciseResource(
            resource.htmlSource,
            presentation.accentCssVariables,
        ),
    }));
}

/**
 * Count the distinct recorded demonstrations published weeks embed.
 *
 * Counting `.cast` files on disk would also count recordings made for weeks
 * that are not published yet, so the figure on the showcase comes from the
 * resolved deck sources instead. A topic reused by two weeks still holds one
 * recording, so sources are de-duplicated by path.
 */
async function countRecordings(catalog) {
    const sources = new Set();
    for (const presentation of catalog.presentations)
        for (const file of presentation.sourceFiles) sources.add(file);
    let total = 0;
    for (const file of sources) {
        if (!file.endsWith(".md")) continue;
        const source = await readFile(file, "utf8").catch(() => "");
        total += source.split("<AsciinemaPlayer").length - 1;
    }
    return total;
}
