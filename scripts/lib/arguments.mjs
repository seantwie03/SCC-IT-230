import path from "node:path";

import { assertExistingFileInside, resolveContainedPath } from "./paths.mjs";
import { validateDeck } from "./registry.mjs";

export function userArguments(args) {
    return args[0] === "--" ? args.slice(1) : args;
}

export function requireNoArguments(args, label) {
    if (args.length !== 0)
        throw new Error(`${label} does not accept arguments.`);
}

export function requireOneId(args, label) {
    if (args.length !== 1 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args[0]))
        throw new Error(`${label} requires exactly one registered deck ID.`);
    return args[0];
}

export async function validateFocusedEntry(
    root,
    argument,
    { courseRoot = "course" } = {},
) {
    const absoluteCourseRoot = resolveContainedPath(
        root,
        courseRoot,
        "course root",
    );
    const relativeCourseRoot = path.relative(
        path.resolve(root),
        absoluteCourseRoot,
    );
    if (
        typeof argument !== "string" ||
        !argument.startsWith(`${relativeCourseRoot}/`)
    )
        throw new Error(
            `A focused deck must be a repository-relative entry beneath ${relativeCourseRoot}/.`,
        );
    if (!argument.endsWith(".md"))
        throw new Error("A focused deck entry must end with .md.");

    const absolute = resolveContainedPath(root, argument, "focused deck entry");
    const relative = path.relative(absoluteCourseRoot, absolute);
    const entry = await assertExistingFileInside(
        absoluteCourseRoot,
        relative,
        "focused deck entry",
    );
    await validateDeck(entry, "focused deck");
    return entry;
}

export function selectRegisteredPresentation(registry, id, label) {
    const presentation = registry.presentations.find((item) => item.id === id);
    if (!presentation)
        throw new Error(`${label} received unknown deck ID: ${id}`);
    return presentation;
}
