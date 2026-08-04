import { readFile } from "node:fs/promises";

import { presentationRoute, withSiteBase } from "../scripts/lib/paths.mjs";

const templateUrl = new URL("./index.html", import.meta.url);
const MATERIAL_SECTIONS = "<!-- IT230_MATERIAL_SECTIONS -->";

export async function renderLandingPage(registry, siteBase = "/") {
    const template = await readFile(templateUrl, "utf8");
    const presentations = registry.presentations
        .map(
            (presentation) => `
                    <li class="material-card">
                        <h3><a href="${withSiteBase(siteBase, presentationRoute(presentation.id))}">${escapeHtml(presentation.title)}</a></h3>
                        <p>${escapeHtml(presentation.summary)}</p>
                        <p class="topics"><span>Topics:</span> ${presentation.topics.map(escapeHtml).join(", ")}</p>
                    </li>`,
        )
        .join("");
    const resources = registry.resources
        .map(
            (resource) => `
                    <li class="material-card">
                        <h3><a href="${withSiteBase(siteBase, resource.path)}">${escapeHtml(resource.title)}</a></h3>
                        <p>${escapeHtml(resource.summary)}</p>
                    </li>`,
        )
        .join("");

    const materialSections = [
        registry.presentations.length > 0
            ? `<section aria-labelledby="presentations-heading">
                <div class="section-heading">
                    <p class="eyebrow">Presentations</p>
                    <h2 id="presentations-heading">Course presentations</h2>
                </div>
                <ul class="material-grid">${presentations}
                </ul>
            </section>`
            : "",
        registry.resources.length > 0
            ? `<section aria-labelledby="resources-heading">
                <div class="section-heading">
                    <p class="eyebrow">Resources</p>
                    <h2 id="resources-heading">Course resources</h2>
                </div>
                <ul class="material-grid">${resources}
                </ul>
            </section>`
            : "",
    ]
        .filter(Boolean)
        .join("\n");

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
