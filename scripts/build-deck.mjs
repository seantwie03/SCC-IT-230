import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    requireOneId,
    selectRegisteredPresentation,
    userArguments,
} from "./lib/arguments.mjs";
import { validateBuildOutputs } from "./lib/build-site.mjs";
import {
    assertSafeGeneratedRoot,
    presentationRoute,
    withSiteBase,
} from "./lib/paths.mjs";
import { run } from "./lib/process.mjs";
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
await run(
    "slidev",
    [
        "build",
        presentation.entryAbsolute,
        "--out",
        output,
        "--base",
        withSiteBase(
            process.env.IT230_SITE_BASE ?? "/",
            presentationRoute(presentation.id),
        ),
        "--without-notes",
    ],
    { cwd: root },
);
