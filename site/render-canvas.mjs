import { escapeHtml } from "./html.mjs";

const colors = {
    text: "#25252b",
    muted: "#55555b",
    line: "#b9b9bf",
    surface: "#ffffff",
    wash: "#eaf4fb",
    link: "#0461be",
};

export function renderCanvasFragment(view) {
    validateCanvasDestinations(view);
    const academy = view.beforeClass
        ? `<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid ${colors.line};">
    <p style="margin: 0 0 4px; color: ${colors.muted}; font-size: 14px; font-weight: 700; text-transform: uppercase;">${escapeHtml(view.beforeClass.label)}</p>
    <h3 style="margin: 0 0 12px; color: ${colors.text};">${escapeHtml(view.beforeClass.heading)}</h3>
    <p style="margin: 0 0 12px;">${escapeHtml(view.beforeClass.preText)}</p>
    <ul>${view.beforeClass.items.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("")}</ul>
</div>`
        : "";
    const certGuide = view.optionalReading
        ? `<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid ${colors.line};">
    <p style="margin: 0 0 4px; color: ${colors.muted}; font-size: 14px; font-weight: 700; text-transform: uppercase;">${escapeHtml(view.optionalReading.label)}</p>
    <h3 style="margin: 0 0 12px; color: ${colors.text};">${escapeHtml(view.optionalReading.heading)}</h3>
    <p style="margin: 0 0 12px;">${escapeHtml(view.optionalReading.preText)}</p>
    <ul>${view.optionalReading.items.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("")}</ul>
</div>`
        : "";
    const labs = `<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid ${colors.line};">
    <p style="margin: 0 0 4px; color: ${colors.muted}; font-size: 14px; font-weight: 700; text-transform: uppercase;">${escapeHtml(view.labs.label)}</p>
    <h3 style="margin: 0 0 12px; color: ${colors.text};">${escapeHtml(view.labs.heading)}</h3>
    <p>${escapeHtml(view.labs.body)}</p>
</div>`;
    return `<div style="max-width: 800px; color: ${colors.text}; background: ${colors.surface}; line-height: 1.5;">
    <div style="padding: 20px; border: 1px solid ${colors.line}; border-radius: 12px; background: ${colors.wash};">
        <h2 style="margin: 0 0 12px; color: ${colors.text};">${escapeHtml(view.title)}</h2>
        <p style="margin: 0;">${escapeHtml(view.summary)}</p>
    </div>
    ${academy}
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid ${colors.line};">
        <p style="margin: 0 0 4px; color: ${colors.muted}; font-size: 14px; font-weight: 700; text-transform: uppercase;">${escapeHtml(view.inClass.label)}</p>
        <h3 style="margin: 0 0 12px; color: ${colors.text};">${escapeHtml(view.inClass.heading)}</h3>
        <p><a href="${escapeHtml(view.inClass.presentationAction.href)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-right: 12px; padding: 10px 16px; border-radius: 8px; color: #ffffff; background: ${colors.link}; font-weight: 700;">${escapeHtml(view.inClass.presentationAction.text)}</a> <a href="${escapeHtml(view.inClass.pdfAction.href)}" target="_blank" rel="noopener noreferrer" style="color: ${colors.link};">${escapeHtml(view.inClass.pdfAction.text)}</a></p>
        <p style="margin: 0 0 12px;">${escapeHtml(view.inClass.preText)}</p>
        <ol>${view.inClass.topics.map(renderCanvasTopic).join("")}</ol>
    </div>
    ${labs}
    ${certGuide}
</div>\n`;
}

function renderCanvasTopic(topic) {
    const exercises = topic.exercises
        .map(
            (exercise) =>
                `<li><a href="${escapeHtml(exercise.href)}" target="_blank" rel="noopener noreferrer" style="color: ${colors.link};">${escapeHtml(exercise.text)}</a></li>`,
        )
        .join("");
    const exerciseList = exercises ? `<ul>${exercises}</ul>` : "";
    return `<li style="margin-bottom: 16px;"><h4 style="margin: 0 0 6px;"><a href="${escapeHtml(topic.href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(topic.text)} slides in a new tab" style="color: ${colors.link};">${escapeHtml(topic.text)}</a></h4>${exerciseList}</li>`;
}

function validateCanvasDestinations(view) {
    const destinations = [
        ["presentation", view.inClass?.presentationAction?.href],
        ["PDF", view.inClass?.pdfAction?.href],
        ...(view.inClass?.topics ?? []).flatMap((topic) => [
            [`${topic.text} slides`, topic.href],
            ...topic.exercises.map((exercise) => [
                exercise.text,
                exercise.href,
            ]),
        ]),
    ];
    for (const [label, href] of destinations) {
        let destination;
        try {
            destination = new URL(href);
        } catch (error) {
            throw new Error(
                `Canvas destination ${label} must be an absolute HTTPS URL.`,
                { cause: error },
            );
        }
        if (
            destination.protocol !== "https:" ||
            destination.username ||
            destination.password
        )
            throw new Error(
                `Canvas destination ${label} must be an absolute HTTPS URL without credentials.`,
            );
    }
}
