/**
 * Export deterministic PNG images of the focused theme gallery.
 *
 * Run `pnpm run capture:theme` from the repository root to replace
 * `packages/slidev-theme-it230/dist/gallery-png` with the complete gallery.
 * Pass one optional Slidev page range, for example
 * `pnpm run capture:theme -- 1,4-7`, to export only selected slides.
 *
 * This wrapper validates the range and deliberately rejects arbitrary Slidev
 * arguments so callers cannot redirect or broaden its generated output. It
 * removes only the fixed gallery-png directory before starting Slidev export.
 */
import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rawArguments = process.argv.slice(2);
const argumentsFromUser =
    rawArguments[0] === "--" ? rawArguments.slice(1) : rawArguments;

if (argumentsFromUser.length > 1) {
    throw new Error("Capture accepts at most one page-range argument.");
}

const [pageRange] = argumentsFromUser;
const validPageRange =
    /^(?:[1-9]\d*)(?:-(?:[1-9]\d*))?(?:,(?:[1-9]\d*)(?:-(?:[1-9]\d*))?)*$/;

if (pageRange && !validPageRange.test(pageRange)) {
    throw new Error(
        "Page range must contain positive slide numbers such as 1,4-7,10.",
    );
}

const themeRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(themeRoot, "dist");
const outputDirectory = path.join(distRoot, "gallery-png");

if (path.relative(distRoot, outputDirectory) !== "gallery-png") {
    throw new Error(
        "Refusing to capture the gallery outside the theme package dist directory.",
    );
}

await rm(outputDirectory, { force: true, recursive: true });

const slidevArguments = [
    "export",
    "example.md",
    "--format",
    "png",
    "--output",
    path.relative(themeRoot, outputDirectory),
];

if (pageRange) slidevArguments.push("--range", pageRange);

const child = spawn("slidev", slidevArguments, {
    cwd: themeRoot,
    shell: process.platform === "win32",
    stdio: "inherit",
});

const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => {
        if (signal)
            reject(new Error(`Slidev capture stopped by signal ${signal}.`));
        else resolve(code ?? 1);
    });
});

if (exitCode !== 0) process.exitCode = exitCode;
