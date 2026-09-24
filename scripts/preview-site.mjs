import path from "node:path";
import { fileURLToPath } from "node:url";

import { requireNoArguments, userArguments } from "./lib/arguments.mjs";
import { buildPublishedSite } from "./lib/build-site.mjs";
import { siteConfiguration } from "./lib/config.mjs";
import { checkGeneratedSite } from "./lib/links.mjs";
import { loadPresentationCatalog } from "./lib/presentations.mjs";
import { SHOWCASE_SLOT_ALIASES } from "./lib/showcase-slots.mjs";
import { createStaticServer, listen } from "./lib/server.mjs";

requireNoArguments(userArguments(process.argv.slice(2)), "Production preview");
const root = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(root, "dist");
const catalog = await loadPresentationCatalog({ root });
const configuration = siteConfiguration();
const { siteBase } = configuration;
await buildPublishedSite({
    catalog,
    root,
    distRoot,
    /*
     * A build of the published course must supply every showcase example, so a
     * slot whose alias no longer matches a slide fails the build rather than
     * quietly publishing a gap.
     */
    showcaseSlotAliases: SHOWCASE_SLOT_ALIASES,
    ...configuration,
});
await checkGeneratedSite({ distRoot, catalog, siteBase });

const server = createStaticServer(distRoot, { siteBase });
const stop = () => server.close();
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
await listen(server, 4040, "Exact production preview");
await new Promise((resolve) => server.once("close", resolve));
