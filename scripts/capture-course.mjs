/**
 * Export deterministic PNG images of one focused course deck for review.
 *
 * Run `pnpm run capture:course -- course/w01.md` to replace root
 * `exports/course-review-png/` with that deck's rendered slides. Pass one
 * optional Slidev page range, for example
 * `pnpm run capture:course -- course/w01.md 1,4-7`, to export only selected
 * slides. Accepts a published or draft `course/` entry, matching
 * `pnpm dev`/`pnpm run review`; this is a review artifact, not a production
 * or supplemental-PDF export.
 *
 * This wrapper validates the entry and range and deliberately rejects
 * arbitrary Slidev arguments so callers cannot redirect or broaden its
 * generated output. It removes only the fixed `course-review-png` directory
 * before starting Slidev export.
 */
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { userArguments, validateFocusedEntry } from "./lib/arguments.mjs";
import { assertSafeGeneratedRoot } from "./lib/paths.mjs";
import { run } from "./lib/process.mjs";

const allArguments = userArguments(process.argv.slice(2));

/**
 * Export one image per click state instead of one per slide.
 *
 * Without it a slide's intermediate states cannot be reviewed at all, because
 * the exporter stops at each slide's final state. Any slide built from clicks
 * is therefore invisible to review exactly where it is most likely to be wrong.
 */
const withClicks = allArguments.includes("--with-clicks");
const rawArguments = allArguments.filter((value) => value !== "--with-clicks");

if (rawArguments.length < 1 || rawArguments.length > 2)
    throw new Error(
        "Capture requires one course entry and accepts at most one page-range argument, plus an optional --with-clicks.",
    );

const [entryArgument, pageRange] = rawArguments;
const validPageRange =
    /^(?:[1-9]\d*)(?:-(?:[1-9]\d*))?(?:,(?:[1-9]\d*)(?:-(?:[1-9]\d*))?)*$/;

if (pageRange && !validPageRange.test(pageRange)) {
    throw new Error(
        "Page range must contain positive slide numbers such as 1,4-7,10.",
    );
}

const root = fileURLToPath(new URL("../", import.meta.url));
const entry = await validateFocusedEntry(root, entryArgument);

const exportsRoot = path.join(root, "exports");
await assertSafeGeneratedRoot(exportsRoot, root);
const outputDirectory = path.join(exportsRoot, "course-review-png");
await assertSafeGeneratedRoot(outputDirectory, exportsRoot);

await rm(outputDirectory, { force: true, recursive: true });

const slidevArguments = [
    "export",
    entry,
    "--format",
    "png",
    "--output",
    outputDirectory,
];

if (pageRange) slidevArguments.push("--range", pageRange);
if (withClicks) slidevArguments.push("--with-clicks");

await run("slidev", slidevArguments, { cwd: root });
