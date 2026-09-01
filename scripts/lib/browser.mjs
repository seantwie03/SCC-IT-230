/**
 * Shared Playwright harness for repository review commands.
 *
 * Slide and exercise checks both need a real rendering engine: layout overflow
 * and reflow are properties of rendered output, not of Markdown or HTML source.
 * This module owns launching the browser, collecting page diagnostics, and
 * tearing everything down so the individual checks stay focused on what they
 * measure.
 */
import { chromium } from "playwright-chromium";

/**
 * Console output that is normal during local rendering and never indicates a
 * defect in course material.
 */
const IGNORED_MESSAGES = [
    /\[vite\] (?:connected|connecting|hot updated)/i,
    /Download the Vue Devtools/i,
    /favicon\.ico/i,
];

/**
 * Messages that indicate broken rendering even when the browser does not treat
 * them as errors. Mermaid reports a failed diagram through a warning, so an
 * error-only policy would let a blank diagram ship.
 */
const FAILING_MESSAGE = /parse error/i;

export async function withBrowser(callback) {
    const browser = await chromium.launch();
    try {
        return await callback(browser);
    } finally {
        await browser.close();
    }
}

/**
 * Record page-level diagnostics for the lifetime of a page.
 *
 * Returns the collected messages; the caller decides which ones matter for the
 * artifact under review.
 */
export function collectPageDiagnostics(page) {
    const messages = [];
    const record = (type, text) => {
        // An error carrying no message cannot be acted on. Slidev's development
        // server emits one during startup.
        if (!text?.trim()) return;
        if (IGNORED_MESSAGES.some((pattern) => pattern.test(text))) return;
        if (type === "error" || FAILING_MESSAGE.test(text))
            messages.push({ type, text });
    };
    page.on("console", (message) => record(message.type(), message.text()));
    page.on("pageerror", (error) =>
        record("error", error.stack ?? error.message),
    );
    return messages;
}

export async function waitForServer(url, { attempts = 90, delay = 1000 } = {}) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
            const response = await fetch(url, { redirect: "manual" });
            if (response.status < 500) return;
        } catch {
            // The server is still starting.
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    throw new Error(`${url} did not become available.`);
}
