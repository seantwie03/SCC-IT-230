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
 * Elements whose clipping is deliberate rather than a loss of information:
 * frames that hold a layout scaled down from a wider viewport, and captions
 * hidden visually because they exist only for assistive technology.
 */
const INTENTIONALLY_CLIPPED =
    ".device-screen, .doc-screen, .showcase-caption-hidden";
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
        const exerciseFillsFrame = await page.evaluate(() => {
            const frame = document.querySelector(".showcase-document iframe");
            const source = frame?.contentDocument;
            const header = source?.querySelector(".site-header");
            const exercise = source?.querySelector(".exercise-document");
            if (!header || !exercise) return false;
            const bounds = exercise.getBoundingClientRect();
            return (
                frame.contentWindow.getComputedStyle(header).display ===
                    "none" &&
                Math.abs(bounds.left) < 1 &&
                Math.abs(bounds.top) < 1 &&
                Math.abs(bounds.width - frame.contentWindow.innerWidth) < 1
            );
        });
        if (!exerciseFillsFrame)
            problems.push(
                "exercise preview retains its top bar or outer gutters",
            );
        if (
            (await page.locator("[data-toggle]").allTextContents()).some(
                (label) => label === "Pause",
            )
        )
            problems.push("autoplay started with reduced motion requested");

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
        problems.push(...(await checkAutoplay(browser)));
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

/** Exercise real scrolling and playback, independently of reduced-motion review. */
async function checkAutoplay(browser) {
    const page = await browser.newPage({
        reducedMotion: "no-preference",
        viewport: DESKTOP,
    });
    const diagnostics = collectPageDiagnostics(page);
    const issues = [];
    let step = "hero starts on load";
    const selector = (alias) => `[data-slot="${alias}"]`;
    const toggle = (alias) => page.locator(`${selector(alias)} [data-toggle]`);
    const progress = (alias) =>
        page.locator(`${selector(alias)} [data-progress]`);
    const waitLabel = (alias, label) =>
        page.waitForFunction(
            ({ selector, label }) =>
                document.querySelector(`${selector} [data-toggle]`)
                    ?.textContent === label,
            { selector: selector(alias), label },
            { timeout: FRAME_TIMEOUT_MS },
        );
    const reveal = (alias) =>
        page.locator(selector(alias)).evaluate((element) =>
            element.scrollIntoView({
                block: "center",
                behavior: "instant",
            }),
        );
    const clock = (alias) =>
        page
            .locator(`${selector(alias)} [data-frame="desktop"] iframe`)
            .contentFrame()
            .locator(".ap-time-elapsed:visible");
    const waitAdvance = async (alias) => {
        const locator = clock(alias);
        await locator.waitFor();
        const before = await locator.textContent();
        await page.waitForFunction(
            ({ alias, before }) => {
                const frame = document.querySelector(
                    `[data-slot="${alias}"] [data-frame="desktop"] iframe`,
                );
                const now = [
                    ...(frame?.contentDocument?.querySelectorAll(
                        ".ap-time-elapsed",
                    ) ?? []),
                ].find(
                    (element) => element.getClientRects().length > 0,
                )?.textContent;
                return Boolean(now && now !== before);
            },
            { alias, before },
            { timeout: 10_000 },
        );
    };

    try {
        await page.goto(`http://localhost:${REVIEW_PORT}${route}`);
        await waitLabel("showcase-1-1", "Pause");
        const initial = await progress("showcase-1-1").textContent();
        await page.waitForFunction(
            (before) => {
                const now = document.querySelector(
                    '[data-slot="showcase-1-1"] [data-progress]',
                )?.textContent;
                return Boolean(now && now !== before);
            },
            initial,
            { timeout: 10_000 },
        );

        step = "scrolling transfers playback to the next example";
        await reveal("showcase-2-1");
        await waitLabel("showcase-2-1", "Pause");
        await waitLabel("showcase-1-1", "Play");
        const paused = await progress("showcase-1-1").textContent();
        await page.waitForTimeout(2000);
        if ((await progress("showcase-1-1").textContent()) !== paused)
            throw new Error("offscreen hero kept advancing");

        step = "returning resumes an unfinished example";
        await reveal("showcase-1-1");
        await waitLabel("showcase-1-1", "Pause");
        await waitLabel("showcase-2-1", "Play");
        await toggle("showcase-1-1").click();
        await reveal("showcase-2-1");
        await waitLabel("showcase-2-1", "Pause");
        await reveal("showcase-1-1");
        step = "manual pause survives scrolling";
        await page.waitForTimeout(2000);
        await waitLabel("showcase-1-1", "Play");

        step = "exercise sequence starts its recording";
        await reveal("showcase-5-1");
        await waitLabel("showcase-5-1", "Pause");
        await waitAdvance("showcase-5-1");

        step = "standalone recording takes over";
        await reveal("showcase-6-1");
        await waitLabel("showcase-6-1", "Pause");
        await waitLabel("showcase-5-1", "Play");
        await waitAdvance("showcase-6-1");
        const stoppedClock = await clock("showcase-5-1").textContent();
        await page.waitForTimeout(2000);
        if ((await clock("showcase-5-1").textContent()) !== stoppedClock)
            throw new Error("offscreen recording kept playing");

        step = "recording resumes on return";
        await reveal("showcase-5-1");
        await waitLabel("showcase-5-1", "Pause");
        await waitAdvance("showcase-5-1");

        step = "enabling reduced motion stops playback";
        await page.emulateMedia({ reducedMotion: "reduce" });
        await waitLabel("showcase-5-1", "Play");

        step = "narrow-screen hero starts with stacked devices";
        await page.setViewportSize(NARROW);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.goto(`http://localhost:${REVIEW_PORT}${route}`);
        await waitLabel("showcase-1-1", "Pause");
    } catch (error) {
        issues.push(`autoplay (${step}): ${error.message}`);
    } finally {
        for (const message of diagnostics)
            issues.push(`autoplay console ${message.type}: ${message.text}`);
        await page.close();
    }
    return issues;
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
    }, INTENTIONALLY_CLIPPED);

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
