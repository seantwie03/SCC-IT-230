import {
    renderCanvasAuthoringPage,
    renderSiteFavicon,
    renderLandingPage,
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
}) {
    const base = validateSiteBase(siteBase);
    const [favicon, styles, landingPage, weeks] = await Promise.all([
        renderSiteFavicon(),
        renderSiteStyles(),
        renderLandingPage(catalog, base),
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
    return { favicon, landingPage, siteBase: base, styles, weeks };
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
