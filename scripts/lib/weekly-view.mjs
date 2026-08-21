import { DEFAULT_SITE_BASE } from "./config.mjs";
import {
    presentationPdfFilename,
    presentationResourceRoute,
    presentationRoute,
    weekOverviewRoute,
    withSiteBase,
} from "./paths.mjs";

const WEEKLY_TEXT = Object.freeze({
    academyLabel: "Before class",
    academyHeading: "Red Hat Academy",
    academyPreText:
        "Review the following Red Hat Academy chapters and complete the Guided Exercises prior to class.",
    agendaLabel: "In class",
    agendaHeading: "Meeting Agenda",
    agendaPreText: "In class we will cover the following topics",
    presentationAction: "Open presentation",
    pdfAction: "Download Slides (PDF)",
    labsLabel: "After class · Required",
    labsHeading: "Lab Assignments",
    labsBody: "Complete the lab assignments in this week’s Canvas module.",
    certGuideLabel: "After class · Optional",
    certGuideHeading: "RHCSA Cert Guide",
    certGuidePreText:
        "Work through the following chapters in the RHCSA Cert Guide. Utilize the 'Do I know this already?' quiz at the start of each chapter to ensure you are using your study time effectively.",
});

export function buildWeeklyView(
    presentation,
    { siteBase = DEFAULT_SITE_BASE, publicOrigin } = {},
) {
    const href = createHrefBuilder(siteBase, publicOrigin);
    const presentationHref = href(presentationRoute(presentation.id));
    const pdfFilename = presentationPdfFilename(presentation.id);
    return deepFreeze({
        id: presentation.id,
        title: presentation.title,
        summary: presentation.summary,
        overviewHref: href(weekOverviewRoute(presentation.id)),
        accentCssVariables: presentation.accentCssVariables,
        beforeClass:
            presentation.academyChapters.length > 0
                ? {
                      label: WEEKLY_TEXT.academyLabel,
                      heading: WEEKLY_TEXT.academyHeading,
                      preText: WEEKLY_TEXT.academyPreText,
                      items: presentation.academyChapters.map((chapter) => ({
                          text: `${chapter.course}, Chapter ${chapter.chapter}: ${chapter.title}`,
                      })),
                  }
                : undefined,
        inClass: {
            label: WEEKLY_TEXT.agendaLabel,
            heading: WEEKLY_TEXT.agendaHeading,
            preText: WEEKLY_TEXT.agendaPreText,
            presentationAction: {
                text: WEEKLY_TEXT.presentationAction,
                href: presentationHref,
            },
            pdfAction: {
                text: WEEKLY_TEXT.pdfAction,
                href: href(
                    presentationResourceRoute(presentation.id, pdfFilename),
                ),
                filename: pdfFilename,
            },
            topics: presentation.agenda.map((topic) => ({
                text: topic.title,
                href: `${presentationHref}#/${topic.routeAlias}`,
                exercises: topic.exercises.map((exercise) => ({
                    text: exercise.title,
                    href: href(
                        presentationResourceRoute(
                            presentation.id,
                            exercise.filename,
                        ),
                    ),
                })),
            })),
        },
        labs: {
            label: WEEKLY_TEXT.labsLabel,
            heading: WEEKLY_TEXT.labsHeading,
            body: WEEKLY_TEXT.labsBody,
        },
        optionalReading:
            presentation.certGuideChapters.length > 0
                ? {
                      label: WEEKLY_TEXT.certGuideLabel,
                      heading: WEEKLY_TEXT.certGuideHeading,
                      preText: WEEKLY_TEXT.certGuidePreText,
                      items: presentation.certGuideChapters.map((chapter) => ({
                          text: `Chapter ${chapter.chapter}: ${chapter.title}`,
                      })),
                  }
                : undefined,
    });
}

export function validatePublicOrigin(value) {
    if (typeof value !== "string" || value.length === 0)
        throw new Error(
            "IT230_PUBLIC_ORIGIN must be a non-empty HTTPS origin.",
        );
    let url;
    try {
        url = new URL(value);
    } catch (error) {
        throw new Error("IT230_PUBLIC_ORIGIN must be a valid HTTPS origin.", {
            cause: error,
        });
    }
    if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash
    )
        throw new Error(
            "IT230_PUBLIC_ORIGIN must be an HTTPS origin without credentials, path, query, or fragment.",
        );
    return url.origin;
}

function createHrefBuilder(siteBase, publicOrigin) {
    const origin =
        publicOrigin === undefined
            ? undefined
            : validatePublicOrigin(publicOrigin);
    return (route) => {
        const relative = withSiteBase(siteBase, route);
        return origin ? `${origin}${relative}` : relative;
    };
}

function deepFreeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.freeze(value);
        for (const child of Object.values(value)) deepFreeze(child);
    }
    return value;
}
