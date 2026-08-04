import { lstat, realpath, stat } from "node:fs/promises";
import path from "node:path";

export function validateSiteBase(value = "/") {
    if (typeof value !== "string" || value.length === 0)
        throw new Error("The site base must be a non-empty string.");
    if (!value.startsWith("/") || !value.endsWith("/"))
        throw new Error(`The site base must begin and end with "/": ${value}`);
    if (value.includes("\\") || value.includes("?") || value.includes("#"))
        throw new Error(`The site base is not a plain URL path: ${value}`);

    let decoded;
    try {
        decoded = decodeURIComponent(value);
    } catch {
        throw new Error(
            `The site base contains invalid URL encoding: ${value}`,
        );
    }

    const segments = decoded.split("/").filter(Boolean);
    if (segments.some((segment) => segment === "." || segment === ".."))
        throw new Error(`The site base cannot contain dot segments: ${value}`);
    if (segments.some((segment) => !/^[A-Za-z0-9._~-]+$/.test(segment)))
        throw new Error(
            `The site base contains an unsupported segment: ${value}`,
        );

    return value;
}

export function presentationRoute(id) {
    return `/${id}/`;
}

export function withSiteBase(siteBase, domainRelativePath) {
    const base = validateSiteBase(siteBase);
    if (
        typeof domainRelativePath !== "string" ||
        !domainRelativePath.startsWith("/")
    )
        throw new Error("A domain-relative path beginning with / is required.");
    return `${base}${domainRelativePath.slice(1)}`;
}

export function resolveContainedPath(root, relativePath, label = "path") {
    if (typeof relativePath !== "string" || relativePath.length === 0)
        throw new Error(`The ${label} must be a non-empty relative path.`);
    if (path.isAbsolute(relativePath) || relativePath.includes("\\"))
        throw new Error(
            `The ${label} must be repository-relative: ${relativePath}`,
        );

    const normalized = path.posix.normalize(relativePath);
    if (
        normalized === "." ||
        normalized === ".." ||
        normalized.startsWith("../") ||
        normalized !== relativePath
    )
        throw new Error(`The ${label} is not canonical: ${relativePath}`);

    const absoluteRoot = path.resolve(root);
    const absolutePath = path.resolve(absoluteRoot, relativePath);
    assertContained(absoluteRoot, absolutePath, label);
    return absolutePath;
}

export function assertContained(root, target, label = "path") {
    const relative = path.relative(path.resolve(root), path.resolve(target));
    if (
        relative === "" ||
        relative === ".." ||
        relative.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relative)
    )
        throw new Error(
            `The ${label} must remain inside ${path.resolve(root)}.`,
        );
    return target;
}

export async function assertExistingFileInside(
    root,
    relativePath,
    label = "file",
) {
    const absoluteRoot = await realpath(root);
    const lexicalPath = resolveContainedPath(root, relativePath, label);

    let fileInfo;
    let resolvedPath;
    try {
        [fileInfo, resolvedPath] = await Promise.all([
            stat(lexicalPath),
            realpath(lexicalPath),
        ]);
    } catch (error) {
        throw new Error(`The ${label} does not exist: ${relativePath}`, {
            cause: error,
        });
    }

    if (!fileInfo.isFile())
        throw new Error(`The ${label} is not a file: ${relativePath}`);
    assertContained(absoluteRoot, resolvedPath, label);
    return resolvedPath;
}

export async function assertSafeGeneratedRoot(generatedRoot, safetyRoot) {
    const absoluteSafetyRoot = path.resolve(safetyRoot);
    const absoluteGeneratedRoot = path.resolve(generatedRoot);
    assertContained(
        absoluteSafetyRoot,
        absoluteGeneratedRoot,
        "generated root",
    );

    try {
        const info = await lstat(absoluteGeneratedRoot);
        if (info.isSymbolicLink())
            throw new Error(
                `Refusing to replace a symbolic-link generated root: ${absoluteGeneratedRoot}`,
            );
        if (!info.isDirectory())
            throw new Error(
                `The generated root exists but is not a directory: ${absoluteGeneratedRoot}`,
            );
    } catch (error) {
        if (error?.code !== "ENOENT") throw error;
    }

    return absoluteGeneratedRoot;
}
