import path from "node:path";
import { fileURLToPath } from "node:url";

import { requireNoArguments, userArguments } from "./lib/arguments.mjs";
import { checkGeneratedSite } from "./lib/links.mjs";
import { loadRegistry } from "./lib/registry.mjs";

requireNoArguments(
    userArguments(process.argv.slice(2)),
    "Generated-site link check",
);
const root = fileURLToPath(new URL("../", import.meta.url));
const registry = await loadRegistry(path.join(root, "slides.config.mjs"), {
    root,
});
await checkGeneratedSite({
    distRoot: path.join(root, "dist"),
    registry,
    siteBase: process.env.IT230_SITE_BASE ?? "/",
});
