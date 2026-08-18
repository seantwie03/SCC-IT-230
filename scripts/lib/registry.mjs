import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parser } from "@slidev/cli";
import { validateDeckAccent } from "../../packages/slidev-theme-it230/scripts/validate-accent.mjs";
import {
    assertExistingFileInside,
    presentationPdfFilename,
    resolveContainedPath,
} from "./paths.mjs";

const PRESENTATION_ID =
    /^(?:w(?:0[1-9]|1[0-6])|(?:it230|rh124|rh134)-[a-z0-9]+(?:-[a-z0-9]+)*)$/;
const RESOURCE_FILENAME = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/;

export async function loadRegistry(
    registryPath,
    { root = process.cwd(), courseRoot = "course" } = {},
) {
    const absoluteRegistry = path.resolve(registryPath);
    const registryInfo = await stat(absoluteRegistry);
    const moduleUrl = pathToFileURL(absoluteRegistry);
    moduleUrl.searchParams.set("mtime", String(registryInfo.mtimeMs));
    const loaded = await import(moduleUrl.href);
    return validateRegistry(loaded.default, { root, courseRoot });
}

export async function validateRegistry(
    registry,
    { root = process.cwd(), courseRoot = "course" } = {},
) {
    if (!isPlainObject(registry))
        throw new Error("The presentation registry must export an object.");

    const keys = Object.keys(registry).sort();
    if (keys.join(",") !== "presentations")
        throw new Error(
            "The presentation registry must contain only presentations.",
        );
    if (!Array.isArray(registry.presentations))
        throw new Error("Registry presentations must be an array.");

    const context = {
        root: path.resolve(root),
        courseRoot: resolveContainedPath(root, courseRoot, "course root"),
    };
    const presentations = [];
    for (const [index, value] of registry.presentations.entries())
        presentations.push(await validatePresentation(value, index, context));

    assertUnique(presentations, "id", "presentation ID");

    return Object.freeze({
        presentations: Object.freeze(presentations),
    });
}

async function validatePresentation(value, index, context) {
    const label = `presentation ${index + 1}`;
    const expectedKeys = ["entry", "id", "summary", "title", "topics"];
    if (isPlainObject(value) && Object.hasOwn(value, "resources"))
        expectedKeys.push("resources");
    assertObjectKeys(value, label, expectedKeys);
    assertRequiredText(value, label, ["id", "title", "summary"]);
    if (!PRESENTATION_ID.test(value.id))
        throw new Error(`${label} has an unsupported ID: ${value.id}`);

    if (!Array.isArray(value.topics) || value.topics.length === 0)
        throw new Error(`${label} topics must be a non-empty array.`);
    if (
        value.topics.some(
            (topic) =>
                typeof topic !== "string" ||
                topic.trim() !== topic ||
                topic.length === 0,
        )
    )
        throw new Error(`${label} topics must be non-empty trimmed strings.`);
    if (new Set(value.topics).size !== value.topics.length)
        throw new Error(`${label} topics must be unique.`);
    if (
        typeof value.entry !== "string" ||
        !value.entry.startsWith(
            `${path.relative(context.root, context.courseRoot)}/`,
        ) ||
        !value.entry.endsWith(".md")
    )
        throw new Error(
            `${label} entry must be a Markdown file beneath ${path.relative(context.root, context.courseRoot)}/.`,
        );

    const entry = await assertExistingFileInside(
        context.courseRoot,
        path.relative(
            context.courseRoot,
            resolveContainedPath(context.root, value.entry, `${label} entry`),
        ),
        `${label} entry`,
    );
    await validateDeck(entry, label);

    if (Object.hasOwn(value, "resources") && !Array.isArray(value.resources))
        throw new Error(`${label} resources must be an array when provided.`);
    const resources = [];
    for (const [resourceIndex, resource] of (value.resources ?? []).entries())
        resources.push(
            await validateResource(resource, resourceIndex, value.id, context),
        );
    assertUnique(resources, "filename", `${label} resource filename`);

    return Object.freeze({
        ...value,
        resources: Object.freeze(resources),
        entryAbsolute: entry,
    });
}

async function validateResource(value, index, presentationId, context) {
    const label = `presentation ${presentationId} resource ${index + 1}`;
    assertObjectKeys(value, label, ["source", "summary", "title"]);
    assertRequiredText(value, label, ["title", "summary"]);
    if (typeof value.source !== "string")
        throw new Error(`${label} source must be a repository-relative path.`);
    const filename = path.posix.basename(value.source);
    if (!RESOURCE_FILENAME.test(filename))
        throw new Error(
            `${label} source basename must be a canonical lowercase filename.`,
        );
    if (
        filename.toLowerCase() ===
        presentationPdfFilename(presentationId).toLowerCase()
    )
        throw new Error(`${label} collides with the generated PDF filename.`);

    const source = await assertExistingFileInside(
        context.root,
        value.source,
        `${label} source`,
    );
    return Object.freeze({ ...value, filename, sourceAbsolute: source });
}

export async function validateDeck(entry, label = "deck") {
    const source = await readFile(entry, "utf8");
    const deck = parser.parseSync(source, entry);
    const headmatter = deck.slides[0]?.frontmatter ?? {};

    if (headmatter.theme !== "it230")
        throw new Error(
            `${label} must select the local theme with theme: it230.`,
        );
    if (headmatter.routerMode !== "hash")
        throw new Error(`${label} must set routerMode: hash.`);
    await validateDeckAccent(entry);
}

function assertObjectKeys(value, label, expectedKeys) {
    if (!isPlainObject(value)) throw new Error(`${label} must be an object.`);
    const actual = Object.keys(value).sort();
    const expected = [...expectedKeys].sort();
    if (actual.join(",") !== expected.join(","))
        throw new Error(`${label} has unsupported or missing fields.`);
}

function assertRequiredText(value, label, keys) {
    for (const key of keys) {
        if (
            typeof value[key] !== "string" ||
            value[key].trim() !== value[key] ||
            value[key].length === 0
        )
            throw new Error(
                `${label} ${key} must be a non-empty trimmed string.`,
            );
    }
}

function assertUnique(values, key, label) {
    const seen = new Set();
    for (const value of values) {
        if (seen.has(value[key]))
            throw new Error(`Duplicate ${label}: ${value[key]}`);
        seen.add(value[key]);
    }
}

function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isSupportedPresentationId(value) {
    return PRESENTATION_ID.test(value);
}
