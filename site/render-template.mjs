import { readFile } from "node:fs/promises";

import {
    accentCssVariables,
    resolveIt230Accent,
} from "../packages/slidev-theme-it230/setup/accent.ts";
import { weekOverviewRoute, withSiteBase } from "../scripts/lib/paths.mjs";
import { buildWeeklyView } from "../scripts/lib/weekly-view.mjs";
import { escapeHtml } from "./html.mjs";

const landingTemplateUrl = new URL("./index.html", import.meta.url);
const weekTemplateUrl = new URL("./week.html", import.meta.url);
const canvasTemplateUrl = new URL("./canvas.html", import.meta.url);
const faviconUrl = new URL(
    "../packages/slidev-theme-it230/public/favicon.svg",
    import.meta.url,
);
const stylesUrl = new URL("./styles.css", import.meta.url);
const MATERIAL_SECTIONS = "<!-- IT230_MATERIAL_SECTIONS -->";

export async function renderLandingPage(catalog, siteBase = "/") {
    const template = await readFile(landingTemplateUrl, "utf8");
    const weeks = catalog.presentations
        .map((presentation) =>
            renderWeekSummary(buildWeeklyView(presentation, { siteBase })),
        )
        .join("");
    const materialSections = catalog.presentations.length
        ? `<section aria-labelledby="presentations-heading">
                <div class="section-heading">
                    <p class="eyebrow">Weekly materials</p>
                    <h2 id="presentations-heading">Course weeks</h2>
                </div>
                <ol class="week-list">${weeks}
                </ol>
            </section>`
        : "";
    return replacePlaceholder(template, MATERIAL_SECTIONS, materialSections);
}

export async function renderWeekPage(
    catalog,
    presentationIndex,
    siteBase = "/",
) {
    const presentation = catalog.presentations[presentationIndex];
    if (!presentation)
        throw new Error(
            `No published week exists at index ${presentationIndex}.`,
        );
    const template = await readFile(weekTemplateUrl, "utf8");
    const view = buildWeeklyView(presentation, { siteBase });
    const previous = catalog.presentations[presentationIndex - 1];
    const next = catalog.presentations[presentationIndex + 1];
    const homeHref = withSiteBase(siteBase, "/");
    const replacements = new Map([
        ["<!-- IT230_WEEK_DESCRIPTION -->", escapeHtml(view.summary)],
        [
            "<!-- IT230_WEEK_DOCUMENT_TITLE -->",
            `${escapeHtml(view.title)} · IT-230`,
        ],
        [
            "<!-- IT230_WEEK_STYLESHEET_HREF -->",
            withSiteBase(siteBase, "/site.css"),
        ],
        ["<!-- IT230_WEEK_HOME_HREF -->", homeHref],
        [
            "<!-- IT230_WEEK_FAVICON_HREF -->",
            withSiteBase(siteBase, "/favicon.svg"),
        ],
        [
            "<!-- IT230_WEEK_CONTENT -->",
            renderWeeklyOverview(view, {
                allWeeksHref: homeHref,
                previous: previous
                    ? {
                          href: withSiteBase(
                              siteBase,
                              weekOverviewRoute(previous.id),
                          ),
                          title: previous.title,
                      }
                    : undefined,
                next: next
                    ? {
                          href: withSiteBase(
                              siteBase,
                              weekOverviewRoute(next.id),
                          ),
                          title: next.title,
                      }
                    : undefined,
            }),
        ],
    ]);
    let result = template;
    for (const [placeholder, value] of replacements)
        result = replaceAllPlaceholders(
            result,
            placeholder,
            value,
            "week-page template",
        );
    return result;
}

export async function renderCanvasAuthoringPage(
    presentation,
    canvasFragment,
    siteBase = "/",
) {
    const template = await readFile(canvasTemplateUrl, "utf8");
    const homeHref = withSiteBase(siteBase, "/");
    const replacements = new Map([
        ["<!-- IT230_CANVAS_WEEK_TITLE -->", escapeHtml(presentation.title)],
        [
            "<!-- IT230_CANVAS_DOCUMENT_TITLE -->",
            `${escapeHtml(presentation.title)} · Canvas HTML`,
        ],
        [
            "<!-- IT230_CANVAS_STYLESHEET_HREF -->",
            withSiteBase(siteBase, "/site.css"),
        ],
        ["<!-- IT230_CANVAS_HOME_HREF -->", homeHref],
        [
            "<!-- IT230_CANVAS_FAVICON_HREF -->",
            withSiteBase(siteBase, "/favicon.svg"),
        ],
    ]);
    let result = replaceTextareaPlaceholder(
        template,
        "<!-- IT230_CANVAS_SOURCE -->",
        escapeHtml(canvasFragment),
    );
    for (const [placeholder, value] of replacements)
        result = replaceAllPlaceholders(
            result,
            placeholder,
            value,
            "Canvas template",
        );
    return result;
}

export async function renderSiteStyles() {
    const styles = await readFile(stylesUrl, "utf8");
    return `${renderCssVariables(accentCssVariables(resolveIt230Accent()))}\n${styles}`;
}

export async function renderSiteFavicon() {
    return readFile(faviconUrl, "utf8");
}

export function renderWeekSummary(view) {
    const style = renderAccentStyle(view.accentCssVariables);
    return `<li class="week-summary-card" style="${escapeHtml(style)}">
                        <p class="week-kicker">${escapeHtml(weekLabel(view.id))}</p>
                        <h3><a href="${escapeHtml(view.overviewHref)}">${escapeHtml(view.title)}</a></h3>
                        <p>${escapeHtml(view.summary)}</p>
                        <div class="week-summary-actions">
                            <a class="primary-action" href="${escapeHtml(view.overviewHref)}">Week overview</a>
                            <a class="secondary-action" href="${escapeHtml(view.inClass.presentationAction.href)}" target="_blank" rel="noopener noreferrer" aria-label="Open presentation in a new tab">Open presentation</a>
                        </div>
                    </li>`;
}

export function renderWeeklyOverview(view, navigation) {
    const style = renderAccentStyle(view.accentCssVariables);
    const academy = view.beforeClass
        ? `<section class="week-phase" aria-labelledby="${view.id}-before">
                        <p class="phase-label">${escapeHtml(view.beforeClass.label)}</p>
                        <h2 id="${view.id}-before">${escapeHtml(view.beforeClass.heading)}</h2>
                        <p class="phase-pretext">${escapeHtml(view.beforeClass.preText)}</p>
                        <ul class="curriculum-list">${view.beforeClass.items.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("")}</ul>
                    </section>`
        : "";
    const certGuide = view.optionalReading
        ? `<section class="week-phase" aria-labelledby="${view.id}-after">
                        <p class="phase-label">${escapeHtml(view.optionalReading.label)}</p>
                        <h2 id="${view.id}-after">${escapeHtml(view.optionalReading.heading)}</h2>
                        <p class="phase-pretext">${escapeHtml(view.optionalReading.preText)}</p>
                        <ul class="curriculum-list">${view.optionalReading.items.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("")}</ul>
                    </section>`
        : "";
    const labs = `<section class="week-phase" aria-labelledby="${view.id}-labs">
                        <p class="phase-label">${escapeHtml(view.labs.label)}</p>
                        <h2 id="${view.id}-labs">${escapeHtml(view.labs.heading)}</h2>
                        <p>${escapeHtml(view.labs.body)}</p>
                    </section>`;
    return `<article class="week-overview" style="${escapeHtml(style)}" aria-labelledby="${view.id}-title">
                <header class="week-header">
                    <p class="week-kicker">${escapeHtml(weekLabel(view.id))}</p>
                    <h1 id="${view.id}-title">${escapeHtml(view.title)}</h1>
                    <p class="week-summary">${escapeHtml(view.summary)}</p>
                </header>
                <div class="week-sequence">
                    ${academy}
                    <section class="week-phase in-class" aria-labelledby="${view.id}-agenda">
                        <p class="phase-label">${escapeHtml(view.inClass.label)}</p>
                        <h2 id="${view.id}-agenda">${escapeHtml(view.inClass.heading)}</h2>
                        <div class="week-actions">
                            <a class="primary-action" href="${escapeHtml(view.inClass.presentationAction.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(view.inClass.presentationAction.text)} in a new tab">${escapeHtml(view.inClass.presentationAction.text)}</a>
                            <a class="secondary-action" href="${escapeHtml(view.inClass.pdfAction.href)}" download="${escapeHtml(view.inClass.pdfAction.filename)}">${escapeHtml(view.inClass.pdfAction.text)}</a>
                        </div>
                        <p class="phase-pretext">${escapeHtml(view.inClass.preText)}</p>
                        <ol class="agenda-list">${view.inClass.topics.map(renderAgendaTopic).join("")}</ol>
                    </section>
                    ${labs}
                    ${certGuide}
                </div>
            </article>
            ${renderWeekNavigation(navigation)}`;
}

function renderAgendaTopic(topic) {
    const exercises = topic.exercises
        .map(
            (exercise) =>
                `<li><a href="${escapeHtml(exercise.href)}">${escapeHtml(exercise.text)}</a></li>`,
        )
        .join("");
    const exerciseList = exercises
        ? `<ul class="topic-links">${exercises}</ul>`
        : "";
    return `<li class="agenda-topic">
                                <h3><a href="${escapeHtml(topic.href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(topic.text)} slides in a new tab">${escapeHtml(topic.text)}</a></h3>
                                ${exerciseList}
                            </li>`;
}

function renderWeekNavigation({ allWeeksHref, previous, next }) {
    return `<nav class="week-navigation" aria-label="Week navigation">
                <ul>
                    ${previous ? `<li class="previous-week"><a href="${escapeHtml(previous.href)}" aria-label="Previous week: ${escapeHtml(previous.title)}">← Previous week</a></li>` : ""}
                    <li class="all-weeks"><a href="${escapeHtml(allWeeksHref)}">All weeks</a></li>
                    ${next ? `<li class="next-week"><a href="${escapeHtml(next.href)}" aria-label="Next week: ${escapeHtml(next.title)}">Next week →</a></li>` : ""}
                </ul>
            </nav>`;
}

function renderAccentStyle(variables) {
    return Object.entries(variables)
        .map(([name, value]) => `${name}: ${value}`)
        .join("; ");
}

function weekLabel(id) {
    return id.toUpperCase().replace("W", "Week ");
}

function renderCssVariables(variables) {
    const declarations = Object.entries(variables)
        .map(([name, value]) => `    ${name}: ${value};`)
        .join("\n");
    return `:root {\n${declarations}\n}`;
}

function replacePlaceholder(template, placeholder, value) {
    const parts = template.split(placeholder);
    if (parts.length !== 2)
        throw new Error(
            `The landing-page template must contain ${placeholder} exactly once.`,
        );
    return `${parts[0]}${value}${parts[1]}`;
}

function replaceAllPlaceholders(template, placeholder, value, templateLabel) {
    if (!template.includes(placeholder))
        throw new Error(`The ${templateLabel} must contain ${placeholder}.`);
    return template.replaceAll(placeholder, value);
}

function replaceTextareaPlaceholder(template, placeholder, value) {
    const parts = template.split(placeholder);
    if (parts.length !== 2)
        throw new Error(
            `The Canvas template must contain ${placeholder} exactly once.`,
        );
    const openingTagEnd = parts[0].lastIndexOf(">");
    const openingTagStart = parts[0].lastIndexOf("<textarea", openingTagEnd);
    if (
        openingTagStart < 0 ||
        openingTagEnd < openingTagStart ||
        parts[0].slice(openingTagEnd + 1).trim() !== "" ||
        !parts[1].startsWith("</textarea>")
    )
        throw new Error(
            "The Canvas source placeholder must be the only textarea content.",
        );
    return `${parts[0].slice(0, openingTagEnd + 1)}${value}${parts[1]}`;
}
