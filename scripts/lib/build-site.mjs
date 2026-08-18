import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderLandingPage } from "../../site/render-template.mjs";
import {
    assertContained,
    assertSafeGeneratedRoot,
    presentationPdfFilename,
    presentationRoute,
    validateSiteBase,
    withSiteBase,
} from "./paths.mjs";
import { run } from "./process.mjs";

export async function buildRegisteredSite({
    registry,
    root,
    distRoot,
    safetyRoot = root,
    siteBase = "/",
}) {
    const absoluteRoot = path.resolve(root);
    const absoluteDist = await assertSafeGeneratedRoot(distRoot, safetyRoot);
    const base = validateSiteBase(siteBase);
    const outputs = validateBuildOutputs(registry, absoluteDist);

    await rm(absoluteDist, { force: true, recursive: true });
    await mkdir(absoluteDist, { recursive: true });

    const [styles, landingPage] = await Promise.all([
        readFile(path.join(absoluteRoot, "site", "styles.css"), "utf8"),
        renderLandingPage(registry, base),
    ]);
    await Promise.all([
        writeFile(path.join(absoluteDist, "index.html"), landingPage),
        writeFile(path.join(absoluteDist, "site.css"), styles),
    ]);

    for (const presentation of registry.presentations) {
        const output = outputs.presentations.get(presentation.id);
        await buildPresentation({
            presentation,
            root: absoluteRoot,
            output,
            siteBase: base,
        });
    }

    return { distRoot: absoluteDist, siteBase: base };
}

export function validateBuildOutputs(registry, distRoot) {
    const presentations = new Map();

    for (const presentation of registry.presentations) {
        const output = path.resolve(distRoot, presentation.id);
        assertContained(distRoot, output, `output for ${presentation.id}`);
        presentations.set(presentation.id, output);
    }

    return { presentations };
}

export async function buildPresentation({
    presentation,
    root,
    output,
    siteBase = "/",
}) {
    const base = validateSiteBase(siteBase);
    await mkdir(path.dirname(output), { recursive: true });
    await run(
        "slidev",
        [
            "build",
            presentation.entryAbsolute,
            "--out",
            output,
            "--base",
            withSiteBase(base, presentationRoute(presentation.id)),
            "--without-notes",
        ],
        { cwd: root },
    );

    const resourcesRoot = path.join(output, "resources");
    await mkdir(resourcesRoot, { recursive: true });
    await run(
        "slidev",
        [
            "export",
            presentation.entryAbsolute,
            "--output",
            path.join(resourcesRoot, presentationPdfFilename(presentation.id)),
        ],
        { cwd: root },
    );
    await Promise.all(
        presentation.resources.map((resource) =>
            copyFile(
                resource.sourceAbsolute,
                path.join(resourcesRoot, resource.filename),
            ),
        ),
    );
}
