/**
 * Validate one course entry the way a production build will.
 *
 * Canonical discovery matches only `course/w01.md` through `course/w16.md`, so
 * a draft's topic metadata, route aliases, curriculum alignments, and declared
 * exercise documents are otherwise unvalidated until it is renamed for
 * publication. This command applies the same checks to a draft, using the week
 * ID it will publish under, so a rename is never the first time those errors
 * appear.
 *
 * Run `pnpm run check:entry -- course/w03-draft.md`.
 *
 * Validation is deliberately separate from `pnpm dev` and `pnpm run review`,
 * which stay usable on an incomplete draft that has no title or summary yet.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { userArguments, validateFocusedEntry } from "./lib/arguments.mjs";
import { validatePresentationEntry } from "./lib/presentations.mjs";

const args = userArguments(process.argv.slice(2));

if (args.length !== 1)
    throw new Error(
        "Entry validation requires exactly one course entry, such as course/w03-draft.md.",
    );

const root = fileURLToPath(new URL("../", import.meta.url));
const entry = await validateFocusedEntry(root, args[0]);
const presentation = await validatePresentationEntry(entry, { root });

console.log(
    `Course entry ${path.relative(root, entry)} validated as week ${presentation.id}.`,
);
