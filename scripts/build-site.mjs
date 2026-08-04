import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildRegisteredSite } from "./lib/build-site.mjs";
import { requireNoArguments, userArguments } from "./lib/arguments.mjs";
import { loadRegistry } from "./lib/registry.mjs";

requireNoArguments(
    userArguments(process.argv.slice(2)),
    "The complete site build",
);

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = await loadRegistry(path.join(root, "slides.config.mjs"), {
    root,
});
await buildRegisteredSite({
    registry,
    root,
    distRoot: path.join(root, "dist"),
    siteBase: process.env.IT230_SITE_BASE ?? "/",
});
