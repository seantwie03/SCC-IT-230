import { readFile } from "node:fs/promises";

import {
    presentationPdfFilename,
    presentationResourceRoute,
    presentationRoute,
    withSiteBase,
} from "../scripts/lib/paths.mjs";

const templateUrl = new URL("./index.html", import.meta.url);
const MATERIAL_SECTIONS = "<!-- IT230_MATERIAL_SECTIONS -->";

export async function renderLandingPage(registry, siteBase = "/") {
    const template = await readFile(templateUrl, "utf8");
    const presentations = registry.presentations
        .map((presentation) => {
            const pdfFilename = presentationPdfFilename(presentation.id);
            const resources = presentation.resources
                .map(
                    (resource) => `
                                <li>
                                    <a href="${withSiteBase(siteBase, presentationResourceRoute(presentation.id, resource.filename))}">${escapeHtml(resource.title)}</a>
                                    <p>${escapeHtml(resource.summary)}</p>
                                </li>`,
                )
                .join("");
            return `
                    <li class="presentation-card">
                        <h3><a href="${withSiteBase(siteBase, presentationRoute(presentation.id))}">${escapeHtml(presentation.title)}</a></h3>
                        <p>${escapeHtml(presentation.summary)}</p>
                        <p class="topics"><span>Topics:</span> ${presentation.topics.map(escapeHtml).join(", ")}</p>
                        <div class="presentation-resources">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="${withSiteBase(siteBase, presentationResourceRoute(presentation.id, pdfFilename))}" download="${pdfFilename}">Download PDF</a></li>${resources}
                            </ul>
                        </div>
                    </li>`;
        })
        .join("");

    const materialSections =
        registry.presentations.length > 0
            ? `<section aria-labelledby="presentations-heading">
                <div class="section-heading">
                    <p class="eyebrow">Presentations</p>
                    <h2 id="presentations-heading">Course presentations</h2>
                </div>
                <ul class="presentation-list">${presentations}
                </ul>
            </section>`
            : "";

    return replacePlaceholder(template, MATERIAL_SECTIONS, materialSections);
}

function replacePlaceholder(template, placeholder, value) {
    const parts = template.split(placeholder);
    if (parts.length !== 2)
        throw new Error(
            `The landing-page template must contain ${placeholder} exactly once.`,
        );
    return `${parts[0]}${value}${parts[1]}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
