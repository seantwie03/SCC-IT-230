/**
 * Prepare a recorded asciicast for publication.
 *
 * `kitty-demo.sh` records more than the exercise: the session opens on the
 * local machine, changes font size, and connects to a lab host before the
 * first section header is drawn, and it ends with a sentinel that is presenter
 * scaffolding rather than course content. This script removes both ends,
 * turns each section header into a navigable marker, and refuses to publish a
 * recording that still carries local shell identity.
 *
 * It is idempotent: existing markers are replaced rather than duplicated, and
 * a recording that is already trimmed is left alone.
 *
 * Run `node scripts/process-casts.mjs course/.../foo-exercise.cast` or
 * `-- --all`. Pass `--check` instead of writing to assert that every
 * recording is already publishable, which is what `pnpm check` runs.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { userArguments } from "./lib/arguments.mjs";
import { discoverCasts, processCast } from "./lib/casts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = userArguments(process.argv.slice(2));
const check = args.includes("--check");
const rest = args.filter((argument) => argument !== "--check");

if (rest.length !== 1)
    throw new Error("Cast processing requires exactly one cast path or --all.");

const targets =
    rest[0] === "--all"
        ? await discoverCasts(path.join(root, "course"))
        : [path.resolve(root, rest[0])];

if (targets.length === 0) throw new Error("No recordings were found.");

const failures = [];
for (const target of targets) {
    const relative = path.relative(root, target);
    const source = await readFile(target, "utf8");
    let result;
    try {
        result = processCast(source);
    } catch (error) {
        failures.push(`${relative}: ${error.message}`);
        continue;
    }

    // Structure first: a recording that is not a publishable shape cannot be
    // trusted to have had its identity trimmed away either.
    if (result.problems.length > 0) {
        failures.push(
            `${relative} is not publishable:\n` +
                result.problems.map((entry) => `    ${entry}`).join("\n"),
        );
        continue;
    }

    if (result.identity.length > 0) {
        failures.push(
            `${relative} still carries local shell identity:\n` +
                result.identity.map((entry) => `    ${entry}`).join("\n"),
        );
        continue;
    }

    if (result.text !== source) {
        if (check) {
            failures.push(
                `${relative} is not processed; run pnpm run casts -- --all`,
            );
            continue;
        }
        await writeFile(target, result.text);
    }
    const changes = [
        result.trimmedLeading > 0 && `trimmed ${result.trimmedLeading} leading`,
        result.trimmedTrailing > 0 &&
            `trimmed ${result.trimmedTrailing} trailing`,
        `${result.markers} marker${result.markers === 1 ? "" : "s"}`,
        result.text === source && "unchanged",
    ].filter(Boolean);
    console.log(`${relative}: ${changes.join(", ")}`);
    for (const warning of result.warnings) console.log(`    note: ${warning}`);
}

if (failures.length > 0) {
    console.error(
        `\nCast processing failed for ${failures.length} recording(s):\n` +
            failures.join("\n"),
    );
    process.exitCode = 1;
}
