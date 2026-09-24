/**
 * Derive the weekly overview excerpt the showcase displays.
 *
 * The overview appears on the showcase as an excerpt rather than as a live
 * document in a frame: a frame showed a whole page shrunk past legibility,
 * while an excerpt shows the part that makes the point, at a size someone can
 * read, as real selectable text rather than a picture of text.
 *
 * It is derived from the published material rather than written out. A
 * hand-written excerpt drifts from the page it claims to show and nothing
 * catches it, so this reads the same builder the real page uses.
 *
 * The exercises on the showcase are live frames instead, so nothing here
 * parses a published document.
 */
import { weekOverviewRoute, withSiteBase } from "./paths.mjs";
import { buildWeeklyView } from "./weekly-view.mjs";

/**
 * The weekly overview's phases, straight from the catalog.
 *
 * No parsing: the same builder the real page uses supplies this, so the
 * excerpt cannot describe a week differently from the week itself.
 */
export function buildOverviewExcerpt(presentation, { siteBase }) {
    const view = buildWeeklyView(presentation, { siteBase });
    const phases = [
        view.beforeClass && {
            body: view.beforeClass.items.map((item) => item.text).slice(0, 2),
            label: view.beforeClass.label,
            title: view.beforeClass.heading,
        },
        {
            body: view.inClass.topics.map((topic) => topic.text).slice(0, 3),
            label: view.inClass.label,
            title: view.inClass.heading,
        },
        {
            body: [view.labs.body],
            label: view.labs.label,
            title: view.labs.heading,
        },
        view.optionalReading && {
            body: view.optionalReading.items
                .map((item) => item.text)
                .slice(0, 2),
            label: view.optionalReading.label,
            title: view.optionalReading.heading,
        },
    ].filter(Boolean);

    return {
        href: withSiteBase(siteBase, weekOverviewRoute(presentation.id)),
        phases,
        summary: view.summary,
        title: view.title,
        weekId: presentation.id,
    };
}
