import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildPublishedSite } from "./lib/build-site.mjs";
import { requireNoArguments, userArguments } from "./lib/arguments.mjs";
import { siteConfiguration } from "./lib/config.mjs";
import { loadPresentationCatalog } from "./lib/presentations.mjs";
import { SHOWCASE_SLOT_ALIASES } from "./lib/showcase-slots.mjs";

requireNoArguments(
    userArguments(process.argv.slice(2)),
    "The complete site build",
);

const root = fileURLToPath(new URL("../", import.meta.url));
const catalog = await loadPresentationCatalog({ root });
await buildPublishedSite({
    catalog,
    root,
    distRoot: path.join(root, "dist"),
    /*
     * A build of the published course must supply every showcase example, so a
     * slot whose alias no longer matches a slide fails the build rather than
     * quietly publishing a gap.
     */
    showcaseSlotAliases: SHOWCASE_SLOT_ALIASES,
    ...siteConfiguration(),
});
