import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    requireOneId,
    selectRegisteredPresentation,
    userArguments,
} from "./lib/arguments.mjs";
import { buildPresentation, validateBuildOutputs } from "./lib/build-site.mjs";
import { assertSafeGeneratedRoot } from "./lib/paths.mjs";
import { loadRegistry } from "./lib/registry.mjs";

const id = requireOneId(
    userArguments(process.argv.slice(2)),
    "Focused deck build",
);
const root = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(root, "dist");
const registry = await loadRegistry(path.join(root, "slides.config.mjs"), {
    root,
});
const presentation = selectRegisteredPresentation(
    registry,
    id,
    "Focused deck build",
);
const output = validateBuildOutputs(registry, distRoot).presentations.get(id);
await mkdir(distRoot, { recursive: true });
await assertSafeGeneratedRoot(output, distRoot);
await rm(output, { force: true, recursive: true });
await buildPresentation({
    presentation,
    root,
    output,
    siteBase: process.env.IT230_SITE_BASE ?? "/",
});
