/**
 * Detect slides whose content does not fit the theme's content box.
 *
 * A deck can build cleanly while slides are visually broken, so this check
 * renders each slide in a real browser and measures it. It fails on content
 * that extends past the layout's content box, and on rendering errors.
 *
 * A slide that merely fills its box is not a problem, so how much room remains
 * below the content is reported by `--verbose` and never fails the check.
 *
 * The boundary is the layout's computed content box rather than the slide
 * edge, because the theme reserves its bottom padding for the slide footer.
 * Content that reaches into that band collides with the footer while still
 * sitting inside the slide, so measuring the slide edge would miss it.
 *
 * Every click state is measured. Content revealed by a later click can overflow
 * even when the slide's final state fits.
 *
 * Run `pnpm run check:slides -- course/w03-draft.md` while authoring, or
 * `pnpm run check:slides -- --all` after changing a shared layout, component,
 * or theme token.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { userArguments, validateFocusedEntry } from "./lib/arguments.mjs";
import { collectPageDiagnostics, withBrowser } from "./lib/browser.mjs";
import { startFocusedDeckServer } from "./lib/development.mjs";
import { discoverCanonicalWeeks } from "./lib/presentations.mjs";

const OVERFLOW_THRESHOLD = 2;
const REVIEW_PORT = 3232;
const VIEWPORT = { height: 1080, width: 1920 };

const root = fileURLToPath(new URL("../", import.meta.url));
const args = userArguments(process.argv.slice(2));
const verbose = args.includes("--verbose");
const targets = args.filter((value) => value !== "--verbose");

if (targets.length !== 1)
    throw new Error(
        "Slide review requires one course entry or --all, such as course/w03-draft.md. Add --verbose to report every slide's clearance.",
    );

const entries =
    targets[0] === "--all"
        ? await discoverCanonicalWeeks(path.join(root, "course"))
        : [await validateFocusedEntry(root, targets[0])];

if (entries.length === 0) throw new Error("No canonical weeks were found.");

let failures = 0;

await withBrowser(async (browser) => {
    for (const entry of entries) {
        const relative = path.relative(root, entry);
        const server = await startFocusedDeckServer({
            entry,
            port: REVIEW_PORT,
            root,
        });
        try {
            const page = await browser.newPage({ viewport: VIEWPORT });
            const diagnostics = collectPageDiagnostics(page);
            await page.goto(server.url, { waitUntil: "networkidle" });
            await page.waitForFunction(() => Boolean(window.__slidev__?.nav), {
                timeout: 30_000,
            });
            const total = await page.evaluate(
                () => window.__slidev__.nav.total,
            );
            const findings = [];
            for (let slide = 1; slide <= total; slide += 1) {
                for (const state of await measureSlide(page, slide))
                    findings.push(state);
            }
            await page.close();

            const overflowing = findings.filter((finding) => finding.overflow);
            failures += overflowing.length + diagnostics.length;
            report(relative, overflowing, diagnostics);
            if (verbose)
                for (const finding of findings)
                    console.log(
                        `  slide ${finding.slide}${state(finding)}: ` +
                            `${finding.clearance ?? "n/a"}px clearance` +
                            (finding.frames.length
                                ? `, terminal ${finding.frames.join(" / ")}px`
                                : "") +
                            (finding.overflow
                                ? `, overflowing ${finding.overflow.edge} by ${finding.overflow.amount}px`
                                : ""),
                    );
        } finally {
            await server.stop();
        }
    }
});

if (failures > 0) {
    console.error(
        `\nSlide review failed: ${failures} problem${failures === 1 ? "" : "s"}.`,
    );
    process.exitCode = 1;
} else {
    console.log("\nSlide review passed.");
}

async function measureSlide(page, slide) {
    await navigate(page, slide, 0);
    const clicksTotal = await page.evaluate(
        () => window.__slidev__.nav.clicksTotal ?? 0,
    );
    const clicksStart = await page.evaluate(
        () => window.__slidev__.nav.clicksStart ?? 0,
    );
    const states = [];
    for (let clicks = clicksStart; clicks <= clicksTotal; clicks += 1) {
        if (clicks !== clicksStart) await navigate(page, slide, clicks);
        const measurement = await page.evaluate(measureInPage, {
            threshold: OVERFLOW_THRESHOLD,
        });
        if (measurement)
            states.push({ ...measurement, clicks, clicksTotal, slide });
    }
    return states;
}

async function navigate(page, slide, clicks) {
    await page.evaluate(
        ([no, click]) => window.__slidev__.nav.go(no, click),
        [slide, clicks],
    );
    await page.waitForFunction(
        ([no, click]) =>
            window.__slidev__.nav.currentSlideNo === no &&
            window.__slidev__.nav.clicks === click,
        [slide, clicks],
        { timeout: 15_000 },
    );
    await page.waitForTimeout(90);
}

/**
 * Measure the active slide inside the page.
 *
 * Returns measurements in canvas pixels so a threshold means the same thing at
 * any viewport size. Slidev scales the whole slide to fit, so a raw device
 * pixel would otherwise change meaning with the window.
 */
function measureInPage({ threshold }) {
    const HIDDEN_CLASSES = [
        "slidev-vclick-hidden",
        "slidev-vclick-gone",
        "slidev-vclick-display-none",
    ];
    // Magic Move renders its line numbers as absolutely positioned spans in a
    // gutter beside the code block, outside the content box by design. Match
    // that class exactly: Slidev also puts `slidev-code-line-numbers` on the
    // code wrapper itself, and a loose match would skip whole code blocks.
    const GUTTER = "shiki-magic-move-line-number";
    const layout = [...document.querySelectorAll(".slidev-layout")].find(
        (element) => element.getBoundingClientRect().height > 0,
    );
    if (!layout || !layout.offsetHeight) return null;

    const rect = layout.getBoundingClientRect();
    const styles = getComputedStyle(layout);
    const scale = rect.height / layout.offsetHeight;
    const toCanvas = (value) => value / scale;
    const box = {
        bottom: rect.bottom - parseFloat(styles.paddingBottom) * scale,
        left: rect.left + parseFloat(styles.paddingLeft) * scale,
        right: rect.right - parseFloat(styles.paddingRight) * scale,
        top: rect.top + parseFloat(styles.paddingTop) * scale,
    };
    const scrolls = (element) => {
        const own = getComputedStyle(element);
        return (
            ["auto", "scroll"].includes(own.overflowX) ||
            ["auto", "scroll"].includes(own.overflowY)
        );
    };
    const hidden = (element) => {
        // Decorative chrome is deliberately positioned outside the content box,
        // so only content a reader perceives is measured.
        if (element.getAttribute("aria-hidden") === "true") return true;
        if (element.classList.contains(GUTTER)) return true;
        const own = getComputedStyle(element);
        if (own.display === "none" || own.visibility === "hidden") return true;
        if (Number.parseFloat(own.opacity) === 0) return true;
        return HIDDEN_CLASSES.some((name) => element.classList.contains(name));
    };

    let worst = null;
    let lowest = null;
    for (const element of layout.querySelectorAll("*")) {
        let skip = false;
        for (
            let node = element;
            node && node !== layout;
            node = node.parentElement
        ) {
            if (hidden(node) || (node !== element && scrolls(node))) {
                skip = true;
                break;
            }
        }
        if (skip || hidden(element)) continue;

        const own = element.getBoundingClientRect();
        if (own.width === 0 || own.height === 0) continue;

        if (carriesContent(element) && (lowest === null || own.bottom > lowest))
            lowest = own.bottom;

        const amounts = {
            bottom: own.bottom - box.bottom,
            left: box.left - own.left,
            right: own.right - box.right,
            top: box.top - own.top,
        };
        for (const [edge, raw] of Object.entries(amounts)) {
            const amount = toCanvas(raw);
            if (amount <= threshold) continue;
            if (!worst || amount > worst.amount)
                worst = {
                    amount: Number(amount.toFixed(2)),
                    edge,
                    selector: describe(element),
                    text: (element.textContent ?? "").trim().slice(0, 70),
                };
        }
    }

    const clearance =
        lowest === null
            ? null
            : Number(toCanvas(box.bottom - lowest).toFixed(2));
    // A terminal frame that changes height between click states makes the whole
    // block move on every click. Reporting its height turns that into a number
    // the author can compare across states rather than something to eyeball.
    const frames = [...layout.querySelectorAll(".it230-terminal")]
        .map((element) => element.getBoundingClientRect())
        .filter((own) => own.height > 0)
        .map((own) => Number(toCanvas(own.height).toFixed(2)));

    return {
        clearance,
        frames,
        overflow: worst,
    };

    /**
     * Whether an element renders something a reader can see.
     *
     * Clearance measures the gap below the last visible content, so a container
     * that merely stretches to fill its box must not count. Only elements with
     * their own text and replaced elements do.
     */
    function carriesContent(element) {
        if (["CANVAS", "IMG", "PRE", "SVG", "VIDEO"].includes(element.tagName))
            return true;
        return [...element.childNodes].some(
            (node) =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
        );
    }

    function describe(element) {
        const classes = element.className?.toString().trim().split(/\s+/) ?? [];
        const meaningful = classes.filter(
            (name) => name && !name.startsWith("slidev-vclick"),
        );
        return (
            element.tagName.toLowerCase() +
            (meaningful.length ? `.${meaningful.slice(0, 2).join(".")}` : "")
        );
    }
}

function report(relative, overflowing, diagnostics) {
    console.log(`\n${relative}`);
    if (overflowing.length === 0 && diagnostics.length === 0) {
        console.log("  no overflow or render errors");
        return;
    }
    for (const finding of overflowing)
        console.log(
            `  FAIL slide ${finding.slide}${state(finding)}: ` +
                `${finding.overflow.selector} overflows ${finding.overflow.edge} ` +
                `by ${finding.overflow.amount}px` +
                (finding.overflow.text ? `: "${finding.overflow.text}"` : ""),
        );
    for (const message of diagnostics)
        console.log(
            `  FAIL render ${message.type}: ${message.text.split("\n")[0]}`,
        );
}

function state(finding) {
    return finding.clicksTotal > 0
        ? ` (click ${finding.clicks}/${finding.clicksTotal})`
        : "";
}
