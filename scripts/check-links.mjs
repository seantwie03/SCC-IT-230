import path from "node:path";
import { fileURLToPath } from "node:url";

import { requireNoArguments, userArguments } from "./lib/arguments.mjs";
import { siteConfiguration } from "./lib/config.mjs";
import { checkGeneratedSite } from "./lib/links.mjs";
import { loadPresentationCatalog } from "./lib/presentations.mjs";

requireNoArguments(
    userArguments(process.argv.slice(2)),
    "Generated-site link check",
);
const root = fileURLToPath(new URL("../", import.meta.url));
const catalog = await loadPresentationCatalog({ root });
await checkGeneratedSite({
    distRoot: path.join(root, "dist"),
    catalog,
    siteBase: siteConfiguration().siteBase,
});
