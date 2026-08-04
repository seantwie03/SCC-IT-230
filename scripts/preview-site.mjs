import path from "node:path";
import { fileURLToPath } from "node:url";

import { requireNoArguments, userArguments } from "./lib/arguments.mjs";
import { buildRegisteredSite } from "./lib/build-site.mjs";
import { checkGeneratedSite } from "./lib/links.mjs";
import { loadRegistry } from "./lib/registry.mjs";
import { createStaticServer, listen } from "./lib/server.mjs";

requireNoArguments(userArguments(process.argv.slice(2)), "Production preview");
const root = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(root, "dist");
const registry = await loadRegistry(path.join(root, "slides.config.mjs"), {
    root,
});
const siteBase = process.env.IT230_SITE_BASE ?? "/";
await buildRegisteredSite({ registry, root, distRoot, siteBase });
await checkGeneratedSite({ distRoot, registry, siteBase });

const server = createStaticServer(distRoot, { siteBase });
const stop = () => server.close();
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
await listen(server, 4040, "Exact production preview");
await new Promise((resolve) => server.once("close", resolve));
