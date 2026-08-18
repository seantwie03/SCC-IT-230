import { lstat, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    requireOneId,
    selectRegisteredPresentation,
    userArguments,
} from "./lib/arguments.mjs";
import {
    assertContained,
    assertSafeGeneratedRoot,
    presentationPdfFilename,
} from "./lib/paths.mjs";
import { run } from "./lib/process.mjs";
import { loadRegistry } from "./lib/registry.mjs";

const id = requireOneId(
    userArguments(process.argv.slice(2)),
    "Deck PDF export",
);
const root = fileURLToPath(new URL("../", import.meta.url));
const registry = await loadRegistry(path.join(root, "slides.config.mjs"), {
    root,
});
const presentation = selectRegisteredPresentation(
    registry,
    id,
    "Deck PDF export",
);
const exportsRoot = path.join(root, "exports");
await assertSafeGeneratedRoot(exportsRoot, root);
await mkdir(exportsRoot, { recursive: true });
const output = path.join(exportsRoot, presentationPdfFilename(id));
assertContained(exportsRoot, output, "PDF export");
try {
    const info = await lstat(output);
    if (info.isSymbolicLink())
        throw new Error(
            `Refusing to replace a symbolic-link export: ${output}`,
        );
    if (!info.isFile())
        throw new Error(`The export path exists but is not a file: ${output}`);
} catch (error) {
    if (error?.code !== "ENOENT") throw error;
}
await rm(output, { force: true });
await run(
    "slidev",
    ["export", presentation.entryAbsolute, "--output", output],
    { cwd: root },
);
