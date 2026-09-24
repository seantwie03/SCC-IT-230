/**
 * Review the built `/showcase/` page.
 *
 * The showcase is an ordinary responsive web page rather than a deck, so it is
 * measured the way exercise documents are: rendered in a real browser at a
 * narrow and a desktop width, then reported on for
 *
 *   - axe-core violations for the WCAG 2.1 A and AA rules it can evaluate
 *   - two-dimensional scrolling at 320 CSS pixels, which WCAG 2.1 SC 1.4.10
 *     (Reflow) prohibits and which axe-core has no rule for
 *   - examples that never rendered, which is how a broken preview bundle shows
 *     itself: the page still builds and still reads correctly, and every claim
 *     on it silently loses its evidence
 *
 * The page embeds slides in scaled frames. Each frame lays its slide out at a
 * real device viewport and scales the result down, so the frame's layout width
 * is legitimately far wider than its box and the reflow rule used for
 * exercises would read that as content lost to clipping. `.device-screen` and
 * `.doc-screen` are therefore exempt from that one rule, and only from it:
 * whatever they contain is visible, only smaller. The page-level test for
 * horizontal scrolling has no exemption at all.
 *
 * Axe runs against the page itself, not the decks inside its frames. Those are
 * separate documents with their own review in `pnpm run check:slides`.
 *
 * The page is read with reduced motion requested, which is both the steadier
 * thing to measure and the state a visitor who asked not to be moved gets.
 *
 * `docs/accessibility.md` requires manual review regardless of the result.
 * Automated rules cover deterministic criteria only: they do not judge reading
 * order, assistive-technology behaviour, or whether the writing is clear.
 *
 * Run `pnpm run check:showcase` after `pnpm run build:site`.
 */
import { access } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { requireNoArguments, userArguments } from "./lib/arguments.mjs";
import { collectPageDiagnostics, withBrowser } from "./lib/browser.mjs";
import { siteConfiguration } from "./lib/config.mjs";
import { showcaseRoute, withSiteBase } from "./lib/paths.mjs";
import { createStaticServer, listen } from "./lib/server.mjs";

/** WCAG 2.1 Reflow specifies a 320 CSS pixel viewport. */
const NARROW = { height: 800, width: 320 };
const DESKTOP = { height: 1080, width: 1920 };
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const REVIEW_PORT = 3233;
/**
 * Frames that hold a layout scaled down from a wider viewport. Clipping is
 * what makes them work rather than a fault in them.
 */
const SCALED_FRAMES = ".device-screen, .doc-screen";
/** How long an example gets to build its frames and report them ready. */
const FRAME_TIMEOUT_MS = 30_000;

const root = fileURLToPath(new URL("../", import.meta.url));
requireNoArguments(userArguments(process.argv.slice(2)), "Showcase review");

const { siteBase } = siteConfiguration();
const distRoot = path.join(root, "dist");
const route = withSiteBase(siteBase, showcaseRoute());

try {
    await access(path.join(distRoot, "showcase", "index.html"));
} catch {
    throw new Error(
        "dist/showcase/index.html is missing. Run `pnpm run build:site` first.",
    );
}

const server = createStaticServer(distRoot, { siteBase });
await listen(server, REVIEW_PORT, "Showcase review");
const problems = [];

try {
    await withBrowser(async (browser) => {
        const page = await browser.newPage({
            reducedMotion: "reduce",
            viewport: DESKTOP,
        });
        const diagnostics = collectPageDiagnostics(page);
        await page.goto(`http://localhost:${REVIEW_PORT}${route}`, {
            waitUntil: "load",
        });

        problems.push(...(await loadEveryExample(page)));

        await page.addScriptTag({
            path: createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
        });
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

        for (const viewport of [DESKTOP, NARROW])
            problems.push(...(await checkReflow(page, viewport)));

        for (const message of diagnostics)
            problems.push(`console ${message.type}: ${message.text}`);
        await page.close();
    });
} finally {
    server.close();
}

console.log(`\n${route}`);
if (problems.length === 0) console.log("  no violations");
else for (const problem of problems) console.log(`  FAIL ${problem}`);

if (problems.length > 0) {
    console.error(
        `\nShowcase review failed: ${problems.length} problem${problems.length === 1 ? "" : "s"}.`,
    );
    process.exitCode = 1;
} else {
    console.log(
        "\nShowcase review passed. Automated rules do not replace the manual review in docs/accessibility.md.",
    );
}

/**
 * Bring every example into view and wait for it to render.
 *
 * Examples build their frames only as they come into reach, so a page read
 * from the top alone would report mostly empty placeholders. Scrolling through
 * once starts them all, and anything still unrendered when the wait runs out is
 * named rather than silently accepted.
 */
async function loadEveryExample(page) {
    const found = await page.evaluate(() => ({
        base: document.body.dataset.previewsBase ?? "",
        slots: document.querySelectorAll("[data-slot]").length,
    }));
    if (!found.base)
        return ["the page declares no preview bundle, so no example can load"];
    if (found.slots === 0) return ["the page carries no slide examples"];

    await page.evaluate(async () => {
        const step = window.innerHeight / 2;
        for (let top = 0; top <= document.body.scrollHeight; top += step) {
            window.scrollTo(0, top);
            await new Promise((resolve) => setTimeout(resolve, 120));
        }
        window.scrollTo(0, 0);
    });

    const deadline = Date.now() + FRAME_TIMEOUT_MS;
    let pending = await pendingFrames(page);
    while (pending.length > 0 && Date.now() < deadline) {
        await page.waitForTimeout(500);
        pending = await pendingFrames(page);
    }
    return pending.map(
        (name) => `example ${name} did not render inside its frame`,
    );
}

/**
 * Name the frames that have not finished rendering.
 *
 * The two kinds report differently. A slide preview is a Slidev document whose
 * bridge marks the document once it has mounted, which is the same signal the
 * page itself waits for. A page frame is an ordinary document, so it is done
 * when it has loaded something.
 */
function pendingFrames(page) {
    return page.evaluate(() =>
        [...document.querySelectorAll("[data-frame], [data-frame-src]")]
            .filter((container) => {
                if (container.dataset.loaded !== "true") return true;
                const frame = container.querySelector("iframe");
                const embedded = frame?.contentDocument;
                if (!embedded) return true;
                return container.hasAttribute("data-frame")
                    ? embedded.documentElement?.dataset?.showcaseReady !==
                          "true"
                    : embedded.readyState !== "complete" ||
                          !embedded.body?.firstElementChild;
            })
            .map(
                (container) =>
                    container.closest("[data-slot]")?.dataset.slot ??
                    container.dataset.frameSrc ??
                    "unnamed frame",
            ),
    );
}

/**
 * Measure the page at one width.
 *
 * Content wider than the viewport either scrolls the page or is silently
 * clipped by an ancestor that hides its overflow. Both fail SC 1.4.10, which
 * requires no two-dimensional scrolling and no loss of information.
 */
async function checkReflow(page, viewport) {
    await page.setViewportSize(viewport);
    // Give the resize a frame to settle before measuring layout.
    await page.evaluate(
        () =>
            new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
    );
    const overflow = await page.evaluate((exempt) => {
        const clipped = [...document.querySelectorAll("*")]
            .filter((element) => {
                if (element.matches(exempt)) return false;
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
    }, SCALED_FRAMES);

    const problems = [];
    if (overflow.scroll > overflow.client + 1)
        problems.push(
            `reflow at ${viewport.width}px: page scrolls horizontally ` +
                `(${overflow.scroll}px of content in ${overflow.client}px)`,
        );
    for (const element of overflow.clipped)
        problems.push(
            `reflow at ${viewport.width}px: content clipped in ${element}`,
        );
    return problems;
}
