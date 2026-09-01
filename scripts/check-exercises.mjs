/**
 * Review the standalone HTML exercise documents students read outside class.
 *
 * Unlike a slide, an exercise document is an ordinary responsive web page, so
 * it must reflow. This check therefore renders each declared exercise at a
 * narrow and a desktop width and reports three classes of problem:
 *
 *   - axe-core violations for the WCAG 2.1 A and AA rules it can evaluate
 *   - two-dimensional scrolling at 320 CSS pixels, which WCAG 2.1 SC 1.4.10
 *     (Reflow) prohibits and which axe-core has no rule for
 *   - breaks in this repository's own document contract
 *
 * `docs/accessibility.md` requires manual review regardless of the result.
 * Automated rules cover deterministic criteria only: they do not judge reading
 * order, assistive-technology behaviour, or whether the writing is clear.
 *
 * Run `pnpm run check:exercises -- course/w03-draft.md` or `-- --all`.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

import { userArguments, validateFocusedEntry } from "./lib/arguments.mjs";
import { withBrowser } from "./lib/browser.mjs";
import {
    discoverCanonicalWeeks,
    validatePresentationEntry,
} from "./lib/presentations.mjs";

/** WCAG 2.1 Reflow specifies a 320 CSS pixel viewport. */
const NARROW = { height: 800, width: 320 };
const DESKTOP = { height: 1080, width: 1920 };
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const require = createRequire(import.meta.url);
const axeSource = require.resolve("axe-core/axe.min.js");

const root = fileURLToPath(new URL("../", import.meta.url));
const args = userArguments(process.argv.slice(2));

if (args.length !== 1)
    throw new Error(
        "Exercise review requires one course entry or --all, such as course/w03-draft.md.",
    );

const entries =
    args[0] === "--all"
        ? await discoverCanonicalWeeks(path.join(root, "course"))
        : [await validateFocusedEntry(root, args[0])];

const exercises = new Map();
for (const entry of entries) {
    const presentation = await validatePresentationEntry(entry, { root });
    for (const resource of presentation.resources)
        if (!exercises.has(resource.sourceAbsolute))
            exercises.set(resource.sourceAbsolute, resource);
}

if (exercises.size === 0) throw new Error("No declared exercises were found.");

let failures = 0;

await withBrowser(async (browser) => {
    for (const exercise of exercises.values()) {
        const relative = path.relative(root, exercise.sourceAbsolute);
        const url = pathToFileURL(exercise.sourceAbsolute).href;
        const problems = [];
        const page = await browser.newPage({ viewport: DESKTOP });
        await page.goto(url, { waitUntil: "load" });

        await page.addScriptTag({ path: axeSource });
        const results = await page.evaluate(
            (tags) =>
                window.axe.run(document, {
                    runOnly: { type: "tag", values: tags },
                }),
            AXE_TAGS,
        );
        for (const violation of results.violations)
            problems.push(
                `axe ${violation.id} (${violation.impact}): ${violation.help} ` +
                    `[${violation.nodes.length} node${violation.nodes.length === 1 ? "" : "s"}]`,
            );

        problems.push(...(await checkContract(page, exercise)));

        for (const viewport of [DESKTOP, NARROW]) {
            await page.setViewportSize(viewport);
            // Give the resize a frame to settle before measuring layout.
            await page.evaluate(
                () =>
                    new Promise((resolve) =>
                        requestAnimationFrame(() =>
                            requestAnimationFrame(resolve),
                        ),
                    ),
            );
            const overflow = await page.evaluate(() => {
                // Content wider than the viewport either scrolls the page or is
                // silently clipped by an ancestor that hides its overflow. Both
                // fail SC 1.4.10, which requires no two-dimensional scrolling
                // and no loss of information.
                const clipped = [...document.querySelectorAll("*")]
                    .filter((element) => {
                        const styles = getComputedStyle(element);
                        return (
                            ["clip", "hidden"].includes(styles.overflowX) &&
                            element.scrollWidth > element.clientWidth + 1
                        );
                    })
                    .map(
                        (element) =>
                            `${element.tagName.toLowerCase()}` +
                            `${element.className ? `.${element.className.toString().trim().split(/\s+/)[0]}` : ""}` +
                            ` (${element.scrollWidth}px in ${element.clientWidth}px)`,
                    );
                return {
                    clipped: clipped.slice(0, 3),
                    client: document.documentElement.clientWidth,
                    scroll: Math.max(
                        document.documentElement.scrollWidth,
                        document.body.scrollWidth,
                    ),
                };
            });
            if (overflow.scroll > overflow.client + 1)
                problems.push(
                    `reflow at ${viewport.width}px: page scrolls horizontally ` +
                        `(${overflow.scroll}px of content in ${overflow.client}px)`,
                );
            for (const element of overflow.clipped)
                problems.push(
                    `reflow at ${viewport.width}px: content clipped in ${element}`,
                );
        }

        await page.close();
        failures += problems.length;
        console.log(`\n${relative}`);
        if (problems.length === 0) console.log("  no violations");
        else for (const problem of problems) console.log(`  FAIL ${problem}`);
    }
});

if (failures > 0) {
    console.error(
        `\nExercise review failed: ${failures} problem${failures === 1 ? "" : "s"}.`,
    );
    process.exitCode = 1;
} else {
    console.log(
        "\nExercise review passed. Automated rules do not replace the manual review in docs/accessibility.md.",
    );
}

/**
 * Check the document contract `docs/course-authoring.md` defines: the declared
 * title is the document's own title and heading, and a reader can always get
 * back to the week and the course.
 */
async function checkContract(page, exercise) {
    const found = await page.evaluate(() => ({
        back: [...document.querySelectorAll("a")].some(
            (link) => link.getAttribute("href") === "../",
        ),
        course: [...document.querySelectorAll("a")].some(
            (link) => link.getAttribute("href") === "../../../",
        ),
        heading: document.querySelector("h1")?.textContent?.trim() ?? null,
        title: document.title.trim(),
    }));
    const problems = [];
    if (found.title !== exercise.title)
        problems.push(
            `document title "${found.title}" does not match the declared title "${exercise.title}"`,
        );
    if (found.heading !== exercise.title)
        problems.push(
            `h1 "${found.heading}" does not match the declared title "${exercise.title}"`,
        );
    if (!found.back) problems.push("no link back to the week overview (../)");
    if (!found.course) problems.push("no course header link (../../../)");
    return problems;
}
