import path from "node:path";
import { parentPort, workerData } from "node:worker_threads";

import { loadPresentationCatalog } from "./presentations.mjs";
import { resolveShowcaseSlots } from "./showcase-previews.mjs";
import { renderPublishedArtifacts } from "./site-artifacts.mjs";

try {
    const catalog = await loadPresentationCatalog({
        root: workerData.root,
        courseRoot: workerData.courseRoot,
    });
    /*
     * Resolve the showcase's examples here, where the catalog already exists.
     * The parent builds the preview bundle from them: that needs a Slidev
     * subprocess, which does not belong in a render worker.
     */
    const showcaseSlots = resolveShowcaseSlots(
        catalog,
        workerData.showcaseSlotAliases ?? [],
    );
    const artifacts = await renderPublishedArtifacts({
        catalog,
        siteBase: workerData.siteBase,
        publicOrigin: workerData.publicOrigin,
        showcase: { slots: showcaseSlots },
    });
    parentPort.postMessage({
        artifacts,
        showcaseSlots,
        implementationDirectories: collectImplementationDirectories(
            workerData.root,
        ),
        sourceFiles: collectSourceFiles(catalog),
    });
} catch (error) {
    parentPort.postMessage({
        error: {
            message: error.message,
            stack: error.stack,
        },
    });
}

function collectSourceFiles(catalog) {
    return catalog.presentations.flatMap((presentation) => [
        ...presentation.sourceFiles,
        ...presentation.resources.map((resource) => resource.sourceAbsolute),
    ]);
}

function collectImplementationDirectories(root) {
    return [
        path.resolve(root, "scripts/lib"),
        path.resolve(root, "site"),
        path.resolve(root, "packages/slidev-theme-it230/setup"),
    ];
}
