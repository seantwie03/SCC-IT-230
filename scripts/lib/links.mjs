import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

import { presentationRoute, validateSiteBase, withSiteBase } from "./paths.mjs";

export async function checkGeneratedSite({
    distRoot,
    registry,
    siteBase = "/",
}) {
    const absoluteDist = path.resolve(distRoot);
    const base = validateSiteBase(siteBase);
    const errors = [];
    const required = [
        "index.html",
        "site.css",
        ...registry.presentations.map(
            ({ id }) => `${presentationRoute(id).slice(1)}index.html`,
        ),
        ...registry.resources.map(({ path: route }) => route.slice(1)),
    ];

    for (const relative of required) {
        if (!(await isFile(path.join(absoluteDist, relative))))
            errors.push(`Missing required generated file: ${relative}`);
    }

    const files = await listFiles(absoluteDist);
    for (const relative of files) {
        const extension = path.extname(relative).toLowerCase();
        if (!new Set([".css", ".html"]).has(extension)) continue;
        const source = await readFile(
            path.join(absoluteDist, relative),
            "utf8",
        );
        const references =
            extension === ".html"
                ? extractHtmlReferences(source)
                : extractCssReferences(source);
        for (const reference of references) {
            const error = await validateReference({
                reference,
                from: relative,
                distRoot: absoluteDist,
                siteBase: base,
            });
            if (error) errors.push(error);
        }
    }

    if (errors.length > 0)
        throw new Error(
            `Generated-site link check failed:\n- ${errors.join("\n- ")}`,
        );
    console.log(
        `Generated-site links verified: ${files.length} files, ${registry.presentations.length} presentations, ${registry.resources.length} resources.`,
    );
}

function extractHtmlReferences(source) {
    return [...source.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(
        (match) => match[1],
    );
}

function extractCssReferences(source) {
    return [...source.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)].map(
        (match) => match[1],
    );
}

async function validateReference({ reference, from, distRoot, siteBase }) {
    if (reference.startsWith("#") || reference.startsWith("data:")) return;
    let target;
    try {
        const fromUrl = withSiteBase(
            siteBase,
            `/${path.posix.dirname(from) === "." ? "" : `${path.posix.dirname(from)}/`}`,
        );
        target = new URL(reference, `https://it230.invalid${fromUrl}`);
    } catch {
        return `${from} contains an invalid URL: ${reference}`;
    }

    if (target.origin !== "https://it230.invalid") {
        if (!["http:", "https:", "mailto:"].includes(target.protocol))
            return `${from} uses an unsupported external URL: ${reference}`;
        return;
    }
    if (!target.pathname.startsWith(siteBase))
        return `${from} points outside the configured site base: ${reference}`;

    let relative;
    try {
        relative = decodeURIComponent(target.pathname.slice(siteBase.length));
    } catch {
        return `${from} contains invalid URL encoding: ${reference}`;
    }
    if (relative.includes("\\") || relative.split("/").includes(".."))
        return `${from} contains an unsafe internal URL: ${reference}`;
    if (relative === "" || relative.endsWith("/")) relative += "index.html";

    const absoluteTarget = path.resolve(distRoot, relative);
    const containment = path.relative(distRoot, absoluteTarget);
    if (
        containment === ".." ||
        containment.startsWith(`..${path.sep}`) ||
        path.isAbsolute(containment)
    )
        return `${from} points outside generated output: ${reference}`;
    if (!(await isFile(absoluteTarget)))
        return `${from} points to a missing generated file: ${reference}`;
}

async function listFiles(root, current = "") {
    const entries = await readdir(path.join(root, current), {
        withFileTypes: true,
    });
    const files = [];
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
        const relative = path.join(current, entry.name);
        if (entry.isDirectory())
            files.push(...(await listFiles(root, relative)));
        else if (entry.isFile()) files.push(relative);
    }
    return files;
}

async function isFile(file) {
    try {
        return (await stat(file)).isFile();
    } catch {
        return false;
    }
}
