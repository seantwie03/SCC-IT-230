import { readFile } from "node:fs/promises";

import {
    accentCssVariables,
    resolveIt230Accent,
} from "../packages/slidev-theme-it230/setup/accent.ts";
import {
    presentationRoute,
    showcaseAssetRoute,
    showcaseRoute,
    weekOverviewRoute,
    withSiteBase,
} from "../scripts/lib/paths.mjs";
import {
    buildShowcaseContent,
    showcaseAccents,
} from "../scripts/lib/showcase-content.mjs";
import { buildOverviewExcerpt } from "../scripts/lib/showcase-excerpts.mjs";
import {
    SHOWCASE_PLAYBACK_SPEED,
    showcaseSlotById,
} from "../scripts/lib/showcase-slots.mjs";
import { buildWeeklyView } from "../scripts/lib/weekly-view.mjs";
import { escapeHtml } from "./html.mjs";

const landingTemplateUrl = new URL("./index.html", import.meta.url);
const weekTemplateUrl = new URL("./week.html", import.meta.url);
const canvasTemplateUrl = new URL("./canvas.html", import.meta.url);
const showcaseTemplateUrl = new URL("./showcase.html", import.meta.url);
const showcaseStylesUrl = new URL("./showcase.css", import.meta.url);
const showcaseScriptUrl = new URL("./showcase.mjs", import.meta.url);
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
            "<!-- IT230_WEEK_ACCENT_STYLE -->",
            renderRootAccentStyle(view.accentCssVariables),
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

export async function renderShowcasePage(
    catalog,
    siteBase = "/",
    { slots = [], recordings = 0 } = {},
) {
    const template = await readFile(showcaseTemplateUrl, "utf8");
    const excerpts = buildShowcaseExcerpts(catalog, siteBase);
    const content = buildShowcaseContent(catalog, {
        excerpts,
        recordings,
        siteBase,
    });
    /*
     * Resolved examples are keyed by the alias the deck carries, while the
     * page refers to positions. A slide with a public name of its own, such as
     * the lab reference students are told to bookmark, keeps that name.
     */
    const byAlias = new Map(slots.map((entry) => [entry.alias, entry]));
    const context = {
        resolve: (id) => {
            const definition = showcaseSlotById(id);
            if (!definition) return undefined;
            const resolved = byAlias.get(definition.alias);
            return resolved ? { definition, resolved } : undefined;
        },
        siteBase,
    };
    const replacements = new Map([
        [
            "<!-- IT230_SHOWCASE_DESCRIPTION -->",
            escapeHtml(
                "How the IT-230 course materials support students in class and afterwards.",
            ),
        ],
        [
            "<!-- IT230_SHOWCASE_DOCUMENT_TITLE -->",
            `${escapeHtml(content.hero.heading)} · IT-230`,
        ],
        [
            "<!-- IT230_SHOWCASE_STYLESHEET_HREF -->",
            withSiteBase(siteBase, "/site.css"),
        ],
        [
            "<!-- IT230_SHOWCASE_PAGE_STYLESHEET_HREF -->",
            withSiteBase(siteBase, showcaseAssetRoute("showcase.css")),
        ],
        [
            "<!-- IT230_SHOWCASE_SCRIPT_HREF -->",
            withSiteBase(siteBase, showcaseAssetRoute("showcase.mjs")),
        ],
        [
            "<!-- IT230_SHOWCASE_FAVICON_HREF -->",
            withSiteBase(siteBase, "/favicon.svg"),
        ],
        [
            "<!-- IT230_SHOWCASE_PREVIEWS_BASE -->",
            `${withSiteBase(siteBase, showcaseRoute())}previews/`,
        ],
        [
            "<!-- IT230_SHOWCASE_PLAYBACK_SPEED -->",
            String(SHOWCASE_PLAYBACK_SPEED),
        ],
        ["<!-- IT230_SHOWCASE_HOME_HREF -->", withSiteBase(siteBase, "/")],
        [
            "<!-- IT230_SHOWCASE_CONTENT -->",
            [
                renderShowcaseHero(content.hero, context),
                renderAccentPicker(),
                ...content.groups.map((group) =>
                    renderShowcaseGroup(group, context),
                ),
                renderShowcaseClosing(content.closing),
            ].join(""),
        ],
    ]);
    let result = template;
    for (const [placeholder, value] of replacements)
        result = replaceAllPlaceholders(
            result,
            placeholder,
            value,
            "showcase template",
        );
    return result;
}

/*
 * Derive the page excerpts.
 *
 * We Do shows the exercise its own sequence uses; You Do shows the exercise
 * belonging to its recording, which is a different week on purpose.
 */
function buildShowcaseExcerpts(catalog, siteBase) {
    return {
        overview:
            catalog.presentations.length > 0
                ? buildOverviewExcerpt(catalog.presentations.at(-1), {
                      siteBase,
                  })
                : undefined,
    };
}

/*
 * An excerpt of a real page, dressed as a page.
 *
 * Nothing here is rendered live, which is what frees it to look like a page
 * rather than be one. The bottom edge fades so the content reads as continuing
 * rather than as cut off, which is the honest signal that this is a fragment
 * and saves a caption having to say so.
 */
function renderPageCard(kind, inner, href, linkText) {
    return `<figure class="showcase-excerpt">
                    <div class="page-card" data-kind="${kind}">
                        <div class="page-card-inner">${inner}</div>
                    </div>
                    <figcaption><a href="${escapeHtml(href)}">${escapeHtml(linkText)}</a></figcaption>
                </figure>`;
}

/*
 * Reproduce the exercise document's own treatment rather than approximating
 * it: an accent-washed header over a step with its generated number, its
 * heading rule, its description and its command. The point of the card is that
 * a reader recognises the real page when they follow the link, so the two
 * should not look like different products.
 *
 * What is left out is the site chrome and the page gutter, which are the parts
 * that carry no meaning at this size.
 */
/*
 * The written exercise, shown as the page itself.
 *
 * An excerpt was tried here and rebuilt to match the document closely, and it
 * still read as a facsimile rather than the thing. A frame of the real page
 * carries its own layout, and the link beneath goes to the same document.
 */
function renderExerciseFrame(block) {
    return `<figure class="showcase-document">
                    <div class="doc-frame">
                        <div class="doc-screen" data-loaded="false" data-frame-src="${escapeHtml(block.href)}" data-frame-size="wide" data-frame-title="${escapeHtml(block.title)}"></div>
                    </div>
                    <figcaption><a class="secondary-action" href="${escapeHtml(block.href)}">Open the written exercise</a></figcaption>
                </figure>`;
}

function renderOverviewExcerpt(excerpt) {
    const phases = excerpt.phases
        .map(
            (phase) =>
                `<li class="excerpt-phase">
                                    <span class="excerpt-phase-label">${escapeHtml(phase.label)}</span>
                                    <span class="excerpt-phase-title">${escapeHtml(phase.title)}</span>
                                    <span class="excerpt-phase-body">${escapeHtml(phase.body.join(" · "))}</span>
                                </li>`,
        )
        .join("");
    return `<p class="excerpt-kicker">${escapeHtml(weekLabel(excerpt.weekId))}</p>
                            <p class="excerpt-title">${escapeHtml(excerpt.title)}</p>
                            <ul class="excerpt-phases">${phases}</ul>`;
}

/*
 * The first figure where the two devices show different things: the recording
 * on the laptop, the written steps on the phone beside it. That is what a
 * student working the lab at home actually looks like.
 *
 * The phone is portrait and holds real text rather than a frame. A slide has
 * to be landscape because it is 16:9; a page does not, and the excerpt is
 * legible at this size precisely because it is not a scaled document.
 *
 * The recording's controls and the exercise link are separate groups so a
 * narrow screen can place each beneath the device it belongs to. The
 * figcaption stays last, as a figure requires.
 */
function renderShowcasePair(block, context) {
    const entry = context.resolve(block.slot);
    if (!entry) return "";
    const { definition, resolved: slot } = entry;
    const title = escapeHtml(slot.title);
    const href = `${withSiteBase(context.siteBase, presentationRoute(slot.weekId))}#/${slot.alias}`;
    return `<figure class="showcase-slot showcase-mixed" data-slot="${escapeHtml(slot.alias)}" data-animated="${Boolean(definition.animated)}" data-recording="${Boolean(definition.recording)}">
                    <div class="showcase-devices">
                        <div class="device device-laptop">
                            <div class="device-shell">
                                <div class="device-screen" data-loaded="false" data-frame="desktop" data-frame-title="${title} recording"></div>
                            </div>
                            <div class="device-base"></div>
                        </div>
                        <div class="device device-phone" data-orientation="portrait">
                            <div class="device-shell">
                                <div class="device-screen" data-loaded="false" data-frame-src="${escapeHtml(block.exerciseHref)}" data-frame-size="phone-portrait" data-frame-title="${escapeHtml(block.exerciseTitle)}"></div>
                            </div>
                        </div>
                    </div>
                    <span class="showcase-progress" data-progress></span>
                    <div class="showcase-pair-controls">
                        <button class="showcase-control" type="button" data-toggle>Play</button>
                        <a class="showcase-control" href="${escapeHtml(href)}">Open the recording</a>
                    </div>
                    <figcaption class="showcase-pair-caption">
                        <span class="showcase-caption-hidden">${escapeHtml(weekLabel(slot.weekId))}, “${title}”, with its written steps beside it.</span>
                        <a class="showcase-control" href="${escapeHtml(block.exerciseHref)}">Open the written exercise</a>
                    </figcaption>
                </figure>`;
}

/*
 * The accent picker.
 *
 * Each week picks one accent and carries it through its slides, its overview
 * and its exercises. The picker lets a visitor try the others, so the label
 * says what it changes: this page, not the published weeks.
 *
 * Buttons carry their own values, so the page script never holds a second copy
 * of the palette.
 */
function renderAccentPicker() {
    const swatches = showcaseAccents()
        .map((accent) => {
            const data = Object.entries(accent.variables)
                .map(
                    ([name, value]) =>
                        `data-var-${name.replace("--it230-color-accent-", "")}="${escapeHtml(value)}"`,
                )
                .join(" ");
            return `<button class="accent-swatch" type="button" role="radio" aria-checked="${accent.name === "blue"}" data-accent="${escapeHtml(accent.name)}" ${data} style="--swatch: ${escapeHtml(accent.variables["--it230-color-accent-fill"])}">
                            <span class="accent-dot"></span>${escapeHtml(accent.title)}
                        </button>`;
        })
        .join("");
    /*
     * The visible heading is a statement, so the group carries its own label:
     * a reader arriving at it by keyboard needs to be told it is a choice,
     * which "Accent colors add variety" does not say.
     */
    return `<div class="accent-picker">
                    <p class="accent-picker-label">Accent colors add variety to the material</p>
                    <div class="accent-swatches" role="radiogroup" aria-label="Choose an accent color for this page">${swatches}</div>
                    <p class="accent-picker-note">
                        The site and slides utilize accent colors inspired by the
                        <a href="https://en.wikipedia.org/wiki/Adwaita_(design_language)">Adwaita design language</a>.
                        Choosing an accent color here changes this page and its examples.
                        Every accent is tested against every background it is used
                        on to ensure WCAG 2.1 AA compliance.
                    </p>
                </div>`;
}

function renderShowcaseHero(hero, context) {
    return `<section class="showcase-hero" aria-labelledby="showcase-title">
                <div class="showcase-hero-intro">
                    <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>
                    <h1 id="showcase-title">${escapeHtml(hero.heading)}</h1>
                    <p class="lede">${escapeHtml(hero.lede)}</p>
                </div>
                ${renderShowcaseSlot(context.resolve("showcase-1-1"), context.siteBase)}
            </section>`;
}

/*
 * A group is a signpost rather than a chapter: one heading, one line, then the
 * sections. Each section still carries its own obstacle and evidence, so it
 * reads correctly to someone who arrives from a link and never sees this
 * heading at all.
 */
function renderShowcaseGroup(group, context) {
    return `<section class="showcase-group" id="group-${escapeHtml(group.id)}" aria-labelledby="group-${escapeHtml(group.id)}-heading">
                <div class="showcase-group-heading">
                    <h2 id="group-${escapeHtml(group.id)}-heading">
                        <span class="showcase-group-label">${escapeHtml(group.label)}</span>
                        <span class="showcase-group-gloss">${escapeHtml(group.gloss)}</span>
                    </h2>
                    <p>${escapeHtml(group.intro)}</p>
                </div>
                ${group.sections.map((section) => renderShowcaseSection(section, context)).join("")}
            </section>`;
}

function renderShowcaseSection(section, context) {
    const overview = section.blocks.some((block) => block.type === "overview");
    return `<section class="showcase-section${overview ? " showcase-section-overview" : ""}" aria-labelledby="section-${escapeHtml(section.id)}">
                    <h3 id="section-${escapeHtml(section.id)}">${escapeHtml(section.heading)}</h3>
                    ${section.blocks.map((block) => renderShowcaseBlock(block, context)).join("")}
                </section>`;
}

function renderShowcaseBlock(block, context) {
    switch (block.type) {
        case "paragraph":
            return `<p>${escapeHtml(block.text)}</p>`;
        case "evidence":
            return `<p class="showcase-evidence">${escapeHtml(block.text)}</p>`;
        case "list":
            return `<ul class="showcase-list">${block.items
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}</ul>`;
        case "actions":
            return renderShowcaseActions(block.items);
        case "stats":
            return `<ul class="showcase-stats">${block.items
                .map(
                    (item) =>
                        `<li><span class="showcase-stat-value">${escapeHtml(String(item.value))}</span><span class="showcase-stat-label">${escapeHtml(item.label)}</span></li>`,
                )
                .join("")}</ul>`;
        case "note":
            return `<aside class="showcase-note">
                        <p class="showcase-note-title">${escapeHtml(block.title)}</p>
                        <p>${escapeHtml(block.text)}</p>
                    </aside>`;
        case "document":
            return renderExerciseFrame(block);
        case "overview":
            return renderPageCard(
                "overview",
                renderOverviewExcerpt(block.excerpt),
                block.excerpt.href,
                `Open the ${weekLabel(block.excerpt.weekId)} overview`,
            );
        case "pair":
            return renderShowcasePair(block, context);
        case "slot":
            return renderShowcaseSlot(
                context.resolve(block.slot),
                context.siteBase,
            );
        default:
            return "";
    }
}

function renderShowcaseActions(items) {
    if (!items?.length) return "";
    return `<div class="showcase-actions">${items
        .map((item) => {
            const className =
                item.variant === "primary"
                    ? "primary-action"
                    : item.variant === "secondary"
                      ? "secondary-action"
                      : "showcase-text-action";
            const download = item.download
                ? ` download="${escapeHtml(item.download)}"`
                : "";
            return `<a class="${className}" href="${escapeHtml(item.href)}"${download}>${escapeHtml(item.text)}</a>`;
        })
        .join("")}</div>`;
}

function renderShowcaseClosing(closing) {
    return `<section class="showcase-closing" aria-labelledby="showcase-closing-heading">
                <h2 id="showcase-closing-heading">${escapeHtml(closing.heading)}</h2>
                <div class="showcase-actions">${closing.links
                    .map(
                        (link) =>
                            `<a class="showcase-text-action" href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a>`,
                    )
                    .join("")}</div>
                <p class="showcase-evidence">${escapeHtml(closing.body)}</p>
            </section>`;
}

/*
 * One example: its device frames, its caption, and its controls.
 *
 * The frames are created by the page script rather than written here, so a
 * visitor without JavaScript is never given an empty box. What the document
 * carries on its own is the caption and the link to the real slide.
 */
function renderShowcaseSlot(entry, siteBase) {
    if (!entry) return "";
    const { definition, resolved: slot } = entry;
    const animated = Boolean(definition.animated);
    const pair = Boolean(definition.devicePair);
    const week = weekLabel(slot.weekId);
    const href = `${withSiteBase(siteBase, presentationRoute(slot.weekId))}#/${slot.alias}`;
    const title = escapeHtml(slot.title);

    const screen = (kind, label) =>
        `<div class="device device-${kind === "phone" ? "phone" : "laptop"}">
                            <div class="device-shell">
                                <div class="device-screen" data-loaded="false" data-frame="${kind}" data-frame-title="${title} on ${label}"></div>
                            </div>
                            ${kind === "desktop" ? '<div class="device-base"></div>' : ""}
                        </div>`;

    const sequence = definition.then
        ? ` data-then="${escapeHtml(definition.then)}" data-recording="${Boolean(definition.recording)}"`
        : "";

    /*
     * A playable example trades its visible caption for controls. The frames
     * are hidden from assistive technology, so the caption stays in the
     * accessibility tree to say what the figure shows.
     */
    const caption = animated
        ? `<figcaption class="showcase-card-actions">
                        <span class="showcase-caption-hidden">${escapeHtml(week)}, “${title}”.</span>
                        <span class="showcase-progress" data-progress></span>
                        <button class="showcase-control" type="button" data-toggle>Play</button>
                        <a class="showcase-control" href="${escapeHtml(href)}">Open this slide</a>
                    </figcaption>`
        : `<figcaption class="showcase-caption">
                        <div class="showcase-caption-text">
                            ${week}, “${title}”. <a href="${escapeHtml(href)}">Open this slide in the presentation</a>.
                        </div>
                    </figcaption>`;

    return `<figure class="showcase-slot" data-slot="${escapeHtml(slot.alias)}" data-animated="${animated}"${sequence}>
                    <div class="showcase-devices">
                        ${screen("desktop", "Laptop")}
                        ${pair ? screen("phone", "Phone") : ""}
                    </div>
                    ${caption}
                </figure>`;
}

export async function renderShowcaseStyles() {
    return readFile(showcaseStylesUrl, "utf8");
}

export async function renderShowcaseScript() {
    return readFile(showcaseScriptUrl, "utf8");
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
                            <a class="secondary-action" href="${escapeHtml(view.inClass.presentationAction.href)}">Open presentation</a>
                        </div>
                    </li>`;
}

export function renderWeeklyOverview(view, navigation) {
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
    return `<article class="week-overview" aria-labelledby="${view.id}-title">
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
                            <a class="primary-action" href="${escapeHtml(view.inClass.presentationAction.href)}">${escapeHtml(view.inClass.presentationAction.text)}</a>
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
                                <h3><a href="${escapeHtml(topic.href)}" aria-label="Open ${escapeHtml(topic.text)} slides">${escapeHtml(topic.text)}</a></h3>
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

/*
 * A week page carries one accent, so its variables belong at document root
 * rather than on the article. The page wash, the header and skip links, focus
 * rings, the selection highlight, and the footer rule are all painted outside
 * the article and would otherwise keep the blue fallback while the week's own
 * content wore its accent. Published exercise pages already receive the same
 * root-level block from `scripts/lib/exercise-resource.mjs`, under the same
 * attribute name. The landing page keeps its per-card inline variables, since
 * it lists every week at once.
 */
function renderRootAccentStyle(variables) {
    const declarations = Object.entries(variables)
        .map(([name, value]) => `                ${name}: ${value};`)
        .join("\n");
    return `<style data-it230-week-accent>
            :root {
${declarations}
            }
        </style>`;
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
