import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
    requireOneId,
    selectPublishedWeek,
    userArguments,
} from "./lib/arguments.mjs";
import { buildPresentation, validateBuildOutputs } from "./lib/build-site.mjs";
import { siteConfiguration } from "./lib/config.mjs";
import { assertSafeGeneratedRoot } from "./lib/paths.mjs";
import { loadPresentationCatalog } from "./lib/presentations.mjs";
import { renderPresentationResources } from "./lib/site-artifacts.mjs";

const id = requireOneId(
    userArguments(process.argv.slice(2)),
    "Focused deck build",
);
const root = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(root, "dist");
const { siteBase } = siteConfiguration();
const catalog = await loadPresentationCatalog({ root });
const presentation = selectPublishedWeek(catalog, id, "Focused deck build");
const output = validateBuildOutputs(catalog, distRoot).presentations.get(id);
const resources = renderPresentationResources(presentation);
await mkdir(distRoot, { recursive: true });
await assertSafeGeneratedRoot(output.slides, distRoot);
await assertSafeGeneratedRoot(output.resources, distRoot);
await Promise.all([
    rm(output.slides, { force: true, recursive: true }),
    rm(output.resources, { force: true, recursive: true }),
]);
await buildPresentation({
    presentation,
    root,
    output,
    siteBase,
});
await Promise.all(
    resources.map((resource) =>
        writeFile(
            path.join(output.resources, resource.filename),
            resource.html,
        ),
    ),
);
