/**
 * The showcase page's content.
 *
 * Prose lives here for the same reason `weekly-view.mjs` owns the weekly
 * labels: the renderer arranges and escapes a model it does not author.
 *
 * `docs/showcase.md` owns the rules this content follows. The two that shape
 * every line: a section names the obstacle a student hits before it names a
 * feature, and nothing on this page argues that the materials are convenient
 * to author.
 *
 * Sections are grouped by the course's own "I Do, We Do, You Do" model. The
 * groups are signposts, not acts: every section makes complete sense with its
 * group heading removed.
 */
import {
    IT230_ACCENT_NAMES,
    accentCssVariables,
    resolveIt230Accent,
} from "../../packages/slidev-theme-it230/setup/accent.ts";
import { DEFAULT_SITE_BASE } from "./config.mjs";
import {
    canvasAuthoringRoute,
    presentationPdfFilename,
    presentationResourceRoute,
    presentationRoute,
    weekOverviewRoute,
    withSiteBase,
} from "./paths.mjs";

export function buildShowcaseContent(
    catalog,
    { siteBase = DEFAULT_SITE_BASE, recordings = 0, excerpts = {} } = {},
) {
    const href = (route) => withSiteBase(siteBase, route);
    const featured = catalog.presentations.at(-1);
    const exercise = firstExercise(catalog);
    /*
     * You Do features a different week from We Do on purpose, so its pair
     * needs that week's exercise rather than the page's default one.
     */
    const youDoExercise = firstExercise(catalog, "w02") ?? exercise;
    const totals = countCatalog(catalog);

    const exerciseHref = exercise
        ? href(presentationResourceRoute(exercise.weekId, exercise.filename))
        : undefined;

    return {
        hero: {
            eyebrow: "IT-230 Linux Administration",
            heading: "From Following Along to Working Alone",
            lede: "Every topic in this course is demonstrated, then practiced together, then worked alone. These are the materials built for each of those three stages.",
            note: "That sequence is the gradual release of responsibility, and the sections below follow it.",
            actions: [
                featured && {
                    href: href(weekOverviewRoute(featured.id)),
                    text: "Explore a week",
                    variant: "primary",
                },
                { href: "#group-i-do", text: "Take the tour", variant: "link" },
            ].filter(Boolean),
        },
        groups: [
            {
                gloss: "the instructor demonstrates",
                id: "i-do",
                intro: "The class meets an idea for the first time, with the instructor leading. These are the choices that decide whether it lands.",
                label: "I Do",
                sections: [
                    {
                        blocks: [
                            {
                                text: "Left whole, an unfamiliar command gets copied rather than understood. This slide shows the finished command first, then names each part in turn, so attention lands on one piece at a time instead of all of them at once. When that student later meets a variation they have never seen, they can work out what changed rather than start over.",
                                type: "paragraph",
                            },
                            { slot: "showcase-2-1", type: "slot" },
                        ],
                        heading:
                            "Deconstruction: show the whole thing, then take it apart",
                        id: "deconstruction",
                    },
                    {
                        blocks: [
                            {
                                text: "An abstract principle is easy to state and hard to use. Here the same idea arrives twice: once as the rule itself, and once as a diagram of that rule applied to a specific case. The sentence is what a student can repeat back. The diagram is what they will picture when they meet the situation for real.",
                                type: "paragraph",
                            },
                            { slot: "showcase-3-1", type: "slot" },
                        ],
                        heading: "Theory in words, theory applied",
                        id: "dual-coding",
                    },
                    {
                        blocks: [
                            {
                                text: "Students return to some material dozens of times and meet other material once. This slide is the returning kind, so it is a table rather than prose: comparing a handful of machines across the same few attributes is a scanning task, and scanning is what tables are for. Because every slide is its own web page, a student can bookmark this one directly, which is not true of a PowerPoint slide, a handout, or an attachment.",
                                type: "paragraph",
                            },
                            { slot: "showcase-4-1", type: "slot" },
                        ],
                        heading: "Built to be bookmarked",
                        id: "reference",
                    },
                ],
            },
            {
                gloss: "the class works through it together",
                id: "we-do",
                intro: "The class runs the same workflow on their own lab machines, with the instructor leading.",
                label: "We Do",
                sections: [
                    {
                        blocks: [
                            {
                                text: "The instructor works through an exercise and the class works through it at the same time, on their own machines. A student who gets something wrong finds out immediately, while there is still someone to ask.",
                                type: "paragraph",
                            },
                            {
                                text: "The same exercise is open on every student's screen. Typing each command out is worth doing, and most do. Pasting from the written exercise is the alternative, trading keystroke practice for attention spent on what the command actually does.",
                                type: "paragraph",
                            },
                            exercise && {
                                caption:
                                    "The written exercise students work from.",
                                href: exerciseHref,
                                title: exercise.title,
                                type: "document",
                            },
                            {
                                text: "A room full of people typing is the part that does not fit on a web page. Below is a recording of one of these demonstrations. Recordings are really made for students returning to an exercise alone, which is the next section.",
                                type: "paragraph",
                            },
                            { slot: "showcase-5-1", type: "slot" },
                        ].filter(Boolean),
                        heading: "Practice while the support is still there",
                        id: "practice",
                    },
                ],
            },
            {
                gloss: "the student works alone",
                id: "you-do",
                intro: "The lab is finished after class, on the student's own time, and this is where support usually disappears.",
                label: "You Do",
                sections: [
                    {
                        blocks: [
                            {
                                text: "\u201cI need to see that command run again\u201d has no good answer in most courses. Asking an instructor to repeat a terminal session is not a plan, and a student will not ask twice.",
                                type: "paragraph",
                            },
                            youDoExercise && {
                                exerciseHref: href(
                                    presentationResourceRoute(
                                        youDoExercise.weekId,
                                        youDoExercise.filename,
                                    ),
                                ),
                                exerciseTitle: youDoExercise.title,
                                slot: "showcase-6-1",
                                type: "pair",
                            },
                            {
                                text: "The demonstration and the steps are both still there, and a student can copy a command straight out of either one rather than retyping it from a screenshot.",
                                type: "paragraph",
                            },
                            featured && {
                                text: "Each week also publishes as a PDF, for the student working somewhere with no network at all.",
                                type: "paragraph",
                            },
                            featured && {
                                items: [
                                    {
                                        download: presentationPdfFilename(
                                            featured.id,
                                        ),
                                        href: href(
                                            presentationResourceRoute(
                                                featured.id,
                                                presentationPdfFilename(
                                                    featured.id,
                                                ),
                                            ),
                                        ),
                                        text: "Download a week as PDF",
                                        variant: "secondary",
                                    },
                                ],
                                type: "actions",
                            },
                        ].filter(Boolean),
                        heading: "The material is still there",
                        id: "still-there",
                    },
                    {
                        blocks: [
                            {
                                text: "A student working alone has to decide what to do before the next class, during it, and afterwards. Guessing wastes the time they have.",
                                type: "paragraph",
                            },
                            excerpts.overview && {
                                excerpt: excerpts.overview,
                                type: "overview",
                            },
                            {
                                text: "Each week is laid out in the order a student meets it: what to read beforehand, what the class will cover, and what to do once they are on their own. Every topic records the chapters it aligns to, stored beside the slide it describes so the two cannot drift apart.",
                                type: "paragraph",
                            },
                            {
                                items: [
                                    {
                                        label: `Red Hat Academy ${plural(totals.academyChapters, "chapter")} covered`,
                                        value: totals.academyChapters,
                                    },
                                    {
                                        label: `RHCSA Cert Guide ${plural(totals.certGuideChapters, "chapter")} covered`,
                                        value: totals.certGuideChapters,
                                    },
                                ],
                                type: "stats",
                            },
                        ].filter(Boolean),
                        heading: "Knowing what to study next",
                        id: "certification",
                    },
                ],
            },
            {
                gloss: "true whether a student is watching, practicing, or alone",
                id: "always",
                intro: "These hold at every stage rather than belonging to one of them.",
                label: "At every stage",
                sections: [
                    {
                        blocks: [
                            {
                                text: "A student using a screen reader, zooming to 200 percent, or working entirely by keyboard should get the same material as everyone else, not a worse copy of it.",
                                type: "paragraph",
                            },
                            {
                                items: [
                                    "WCAG 2.1 Level AA is the minimum target for the site, slides and every student-facing document.",
                                    "Automated accessibility tests run against every build of this site.",
                                    "Pages are checked at both a wide and a 320 pixel width, so nothing is silently cut off.",
                                    "Color is reinforcement only. Meaning always carries a label, a symbol, or structure as well.",
                                    "Recorded demonstrations are replayable text rather than video, so they can be paused, read by assistive technology, and copied from.",
                                ],
                                type: "list",
                            },
                        ],
                        heading: "Accessible in every phase",
                        id: "accessible",
                    },
                    {
                        blocks: [
                            {
                                text: "Students live in Canvas. Materials that live somewhere else are materials that do not get found, and the lab assignment that ends each week is itself a Canvas assignment.",
                                type: "paragraph",
                            },
                            {
                                text: "Every week also produces a Canvas-ready page carrying that week's agenda, its exercises, and links that go straight to the relevant topic rather than to the front of a deck. The instructor pastes it in. Every destination is checked when it is produced, so a link that is not a plain secure address is refused rather than published.",
                                type: "paragraph",
                            },
                            featured && {
                                items: [
                                    {
                                        href: href(
                                            canvasAuthoringRoute(featured.id),
                                        ),
                                        text: "See what gets pasted into Canvas",
                                        variant: "secondary",
                                    },
                                ],
                                type: "actions",
                            },
                        ].filter(Boolean),
                        heading: "Where students already are",
                        id: "canvas",
                    },
                ],
            },
        ],
        closing: {
            body: "These materials are maintained independently for IT-230 at St. Charles Community College. The college and Red Hat do not operate or endorse this site.",
            heading: "Explore the course",
            links: [
                featured && {
                    href: href(weekOverviewRoute(featured.id)),
                    text: "Explore a week",
                },
                { href: href("/"), text: "Browse all weeks" },
                {
                    href: "https://github.com/seantwie03/SCC-IT-230",
                    text: "View the public source",
                },
            ].filter(Boolean),
        },
    };
}

function firstExercise(catalog, weekId) {
    const candidates = weekId
        ? catalog.presentations.filter((entry) => entry.id === weekId)
        : [...catalog.presentations].reverse();
    for (const presentation of candidates)
        for (const topic of presentation.agenda)
            for (const exercise of topic.exercises)
                return {
                    filename: exercise.filename,
                    title: exercise.title,
                    weekId: presentation.id,
                };
    return undefined;
}

function countCatalog(catalog) {
    const academy = new Set();
    const certGuide = new Set();
    let topics = 0;
    for (const presentation of catalog.presentations) {
        topics += presentation.agenda.length;
        for (const chapter of presentation.academyChapters)
            academy.add(`${chapter.course} ${chapter.chapter}`);
        for (const chapter of presentation.certGuideChapters)
            certGuide.add(chapter.chapter);
    }
    return {
        academyChapters: academy.size,
        certGuideChapters: certGuide.size,
        topics,
        weeks: catalog.presentations.length,
    };
}

function plural(count, noun) {
    return count === 1 ? noun : `${noun}s`;
}

/**
 * The selectable palette, resolved from the theme.
 *
 * The values travel to the page as data attributes so the picker never holds a
 * second copy of the palette. `setup/accent.ts` stays the only place these
 * colors are written down.
 */
export function showcaseAccents() {
    return IT230_ACCENT_NAMES.map((name) => ({
        name,
        title: name.charAt(0).toUpperCase() + name.slice(1),
        variables: accentCssVariables(resolveIt230Accent(name)),
    }));
}
