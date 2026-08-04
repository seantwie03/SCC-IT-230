import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { parser } from "@slidev/cli";
import { validateDeckAccent } from "../../packages/slidev-theme-it230/scripts/validate-accent.mjs";
import {
    assertExistingFileInside,
    presentationRoute,
    resolveContainedPath,
} from "./paths.mjs";

const PRESENTATION_ID =
    /^(?:w(?:0[1-9]|1[0-6])|(?:it230|rh124|rh134)-[a-z0-9]+(?:-[a-z0-9]+)*)$/;
const RESOURCE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESOURCE_ROUTE =
    /^\/resources\/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?(?:\/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?)*$/;
const REQUIRED_TEXT = ["id", "title", "summary"];

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
    if (keys.join(",") !== "presentations,resources")
        throw new Error(
            "The presentation registry must contain only presentations and resources.",
        );
    if (!Array.isArray(registry.presentations))
        throw new Error("Registry presentations must be an array.");
    if (!Array.isArray(registry.resources))
        throw new Error("Registry resources must be an array.");

    const context = {
        root: path.resolve(root),
        courseRoot: resolveContainedPath(root, courseRoot, "course root"),
    };
    const presentations = [];
    for (const [index, value] of registry.presentations.entries())
        presentations.push(await validatePresentation(value, index, context));

    const resources = [];
    for (const [index, value] of registry.resources.entries())
        resources.push(await validateResource(value, index, context));

    assertUnique(presentations, "id", "presentation ID");
    assertUnique(resources, "id", "resource ID");
    assertUnique(resources, "path", "resource route");

    const allRoutes = [
        ...presentations.map(({ id }) => presentationRoute(id)),
        ...resources.map(({ path: route }) => route),
    ];
    if (new Set(allRoutes).size !== allRoutes.length)
        throw new Error("Presentation and resource routes must be unique.");

    return Object.freeze({
        presentations: Object.freeze(presentations),
        resources: Object.freeze(resources),
    });
}

async function validatePresentation(value, index, context) {
    const label = `presentation ${index + 1}`;
    assertObjectKeys(value, label, [
        "entry",
        "id",
        "summary",
        "title",
        "topics",
    ]);
    assertRequiredText(value, label);
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

    return Object.freeze({ ...value, entryAbsolute: entry });
}

async function validateResource(value, index, context) {
    const label = `resource ${index + 1}`;
    assertObjectKeys(value, label, [
        "id",
        "path",
        "publicationBasis",
        "source",
        "summary",
        "title",
    ]);
    assertRequiredText(value, label);
    if (!RESOURCE_ID.test(value.id))
        throw new Error(`${label} has an unsupported ID: ${value.id}`);
    if (
        typeof value.publicationBasis !== "string" ||
        value.publicationBasis.trim() !== value.publicationBasis ||
        value.publicationBasis.length === 0
    )
        throw new Error(`${label} requires a public publicationBasis.`);
    if (typeof value.path !== "string" || !RESOURCE_ROUTE.test(value.path))
        throw new Error(
            `${label} path must identify one canonical lowercase file beneath /resources/.`,
        );
    const normalizedRoute = path.posix.normalize(value.path);
    if (normalizedRoute !== value.path || normalizedRoute.includes("../"))
        throw new Error(`${label} path is not canonical: ${value.path}`);
    if (path.posix.extname(value.path).toLowerCase() === ".pdf")
        throw new Error(`${label} cannot publish a standard Slidev PDF.`);

    const source = await assertExistingFileInside(
        context.root,
        value.source,
        `${label} source`,
    );
    return Object.freeze({ ...value, sourceAbsolute: source });
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

function assertRequiredText(value, label) {
    for (const key of REQUIRED_TEXT) {
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
