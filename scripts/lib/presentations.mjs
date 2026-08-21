import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { parser } from "@slidev/cli";
import {
    accentCssVariables,
    resolveIt230Accent,
} from "../../packages/slidev-theme-it230/setup/accent.ts";
import { validateExerciseResourceSource } from "./exercise-resource.mjs";
import {
    assertContained,
    assertExistingFileInside,
    presentationPdfFilename,
    resolveContainedPath,
} from "./paths.mjs";

export const CANONICAL_WEEK_FILENAME = /^w(0[1-9]|1[0-6])\.md$/;
const WEEK_ID = /^w(0[1-9]|1[0-6])$/;
const ROUTE_ALIAS = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const EXERCISE_FILENAME = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?-exercise\.html$/;
const CHAPTER = /^\d{2}$/;

export async function loadPresentationCatalog({
    root = process.cwd(),
    courseRoot = "course",
} = {}) {
    const absoluteRoot = path.resolve(root);
    const absoluteCourseRoot = resolveContainedPath(
        absoluteRoot,
        courseRoot,
        "course root",
    );
    const entries = await discoverCanonicalWeeks(absoluteCourseRoot);
    const presentations = [];
    for (const entry of entries)
        presentations.push(
            await loadPresentation(entry, {
                root: absoluteRoot,
                courseRoot: absoluteCourseRoot,
            }),
        );
    return deepFreeze({ presentations });
}

export async function discoverCanonicalWeeks(courseRoot) {
    const absoluteCourseRoot = path.resolve(courseRoot);
    const entries = await readdir(absoluteCourseRoot, { withFileTypes: true });
    const matches = entries
        .filter((entry) => CANONICAL_WEEK_FILENAME.test(entry.name))
        .sort((a, b) => a.name.localeCompare(b.name));
    const discovered = [];
    for (const entry of matches) {
        if (entry.isSymbolicLink())
            throw new Error(
                `Canonical week ${entry.name} cannot be a symlink.`,
            );
        if (!entry.isFile())
            throw new Error(
                `Canonical week ${entry.name} must be a regular file.`,
            );
        discovered.push(
            await assertExistingFileInside(
                absoluteCourseRoot,
                entry.name,
                `canonical week ${entry.name}`,
            ),
        );
    }
    return discovered;
}

async function loadPresentation(entryAbsolute, context) {
    const filename = path.basename(entryAbsolute);
    const id = filename.slice(0, -3);
    const label = `canonical week ${filename}`;
    const data = await loadResolvedDeck(entryAbsolute, context, label);
    const headmatter = validateWeekHeadmatter(data, id, entryAbsolute, label);
    validateRouteAliases(data, context);
    const topics = await collectTopicMetadata(data, id, context, label);
    const sourceFiles = Object.keys(data.watchFiles).map((file) =>
        path.resolve(file),
    );
    return {
        id,
        title: headmatter.title,
        summary: headmatter.summary,
        entryAbsolute,
        accentCssVariables: headmatter.accentCssVariables,
        ...topics,
        sourceFiles,
    };
}

async function loadResolvedDeck(entryAbsolute, context, label) {
    const data = await parser.load(
        {
            userRoot: context.root,
            roots: [context.root, context.courseRoot],
            allowedRoots: [context.root, context.courseRoot],
        },
        entryAbsolute,
    );
    assertParserErrors(data, context.root, label);

    for (const slide of data.entry.slides) {
        if (
            slide.frontmatter?.src &&
            Object.hasOwn(slide.frontmatter, "topicInfo")
        )
            throw new Error(
                `${sourceLabel(slide, context.root)}: topicInfo belongs on the imported topic slide, not an import block.`,
            );
    }
    return data;
}

function validateWeekHeadmatter(data, id, entryAbsolute, label) {
    const headmatter = data.entry.slides[0]?.frontmatter ?? {};
    assertExactKeys(headmatter.courseInfo, `${label} courseInfo`, ["summary"]);
    if (headmatter.theme !== "it230")
        throw new Error(
            `${label} must select the local theme with theme: it230.`,
        );
    if (headmatter.routerMode !== "hash")
        throw new Error(`${label} must set routerMode: hash.`);
    const title = requiredText(headmatter.title, `${label} title`);
    const summary = requiredText(
        headmatter.courseInfo.summary,
        `${label} courseInfo.summary`,
    );
    for (const forbidden of ["id", "presentationId"]) {
        if (Object.hasOwn(headmatter, forbidden))
            throw new Error(
                `${label} must not declare ${forbidden}; its ID is ${id}.`,
            );
    }

    let accent;
    try {
        accent = resolveIt230Accent(headmatter.themeConfig?.it230Accent);
    } catch (error) {
        throw new Error(`${entryAbsolute}: ${error.message}`, { cause: error });
    }
    return {
        title,
        summary,
        accentCssVariables: accentCssVariables(accent),
    };
}

function validateRouteAliases(data, context) {
    const allAliases = new Map();
    for (const slide of data.slides) {
        if (!Object.hasOwn(slide.frontmatter, "routeAlias")) continue;
        const alias = slide.frontmatter.routeAlias;
        if (typeof alias !== "string" || !ROUTE_ALIAS.test(alias))
            throw new Error(
                `${sourceLabel(slide.source, context.root)}: routeAlias must match ${ROUTE_ALIAS}.`,
            );
        if (allAliases.has(alias))
            throw new Error(
                `${sourceLabel(slide.source, context.root)}: duplicate routeAlias ${alias}; first declared at ${allAliases.get(alias)}.`,
            );
        allAliases.set(alias, sourceLabel(slide.source, context.root));
    }
}

async function collectTopicMetadata(data, id, context, label) {
    const academyByIdentity = new Map();
    const certByIdentity = new Map();
    const exerciseBySource = new Map();
    const exerciseByFilename = new Map();
    const resources = [];
    const agenda = [];
    for (const slide of data.slides) {
        if (!Object.hasOwn(slide.frontmatter, "topicInfo")) continue;
        const topic = await validateTopic(slide, id, context);
        for (const alignment of topic.academyChapters)
            mergeAlignment(
                academyByIdentity,
                `${alignment.course}:${alignment.chapter}`,
                alignment,
                "Red Hat Academy",
            );
        for (const alignment of topic.certGuideChapters)
            mergeAlignment(
                certByIdentity,
                alignment.chapter,
                alignment,
                "RHCSA Cert Guide",
            );

        const exercises = [];
        for (const exercise of topic.exercises) {
            const existing = exerciseBySource.get(exercise.sourceAbsolute);
            if (existing) {
                if (existing.title !== exercise.title)
                    throw new Error(
                        `${topic.location}: repeated exercise ${exercise.filename} has conflicting metadata.`,
                    );
                continue;
            }
            const collision = exerciseByFilename.get(exercise.filename);
            if (
                collision &&
                collision.sourceAbsolute !== exercise.sourceAbsolute
            )
                throw new Error(
                    `${topic.location}: exercise filename ${exercise.filename} collides with another source.`,
                );
            exerciseBySource.set(exercise.sourceAbsolute, exercise);
            exerciseByFilename.set(exercise.filename, exercise);
            resources.push(exercise);
            exercises.push(exercise);
        }
        agenda.push({
            title: topic.title,
            routeAlias: topic.routeAlias,
            exercises,
        });
    }
    if (agenda.length === 0)
        throw new Error(`${label} must resolve at least one topicInfo slide.`);

    const academyChapters = [...academyByIdentity.values()].sort(
        (a, b) =>
            a.course.localeCompare(b.course) ||
            Number(a.chapter) - Number(b.chapter),
    );
    const certGuideChapters = [...certByIdentity.values()].sort(
        (a, b) => Number(a.chapter) - Number(b.chapter),
    );
    return {
        academyChapters,
        certGuideChapters,
        agenda,
        resources,
    };
}

async function validateTopic(slide, presentationId, context) {
    const location = sourceLabel(slide.source, context.root);
    const info = slide.frontmatter.topicInfo;
    assertAllowedKeys(info, `${location} topicInfo`, [
        "alignments",
        "exercises",
    ]);
    const title = requiredText(slide.title, `${location} topic title`);
    const routeAlias = slide.frontmatter.routeAlias;
    if (typeof routeAlias !== "string" || !ROUTE_ALIAS.test(routeAlias))
        throw new Error(
            `${location}: topicInfo slides require a canonical routeAlias.`,
        );

    const alignments = info.alignments ?? {};
    assertAllowedKeys(alignments, `${location} topicInfo.alignments`, [
        "redHatAcademy",
        "rhcsaCertGuide",
    ]);
    const academyChapters = validateAlignmentArray(
        alignments.redHatAcademy,
        `${location} Red Hat Academy alignment`,
        true,
    );
    const certGuideChapters = validateAlignmentArray(
        alignments.rhcsaCertGuide,
        `${location} RHCSA Cert Guide alignment`,
        false,
    );

    const exerciseValues = info.exercises ?? [];
    if (!Array.isArray(exerciseValues))
        throw new Error(`${location} topicInfo.exercises must be an array.`);
    const exercises = [];
    for (const [index, value] of exerciseValues.entries())
        exercises.push(
            await validateExercise(
                value,
                `${location} exercise ${index + 1}`,
                presentationId,
                slide.source.filepath,
            ),
        );
    return {
        title,
        routeAlias,
        academyChapters,
        certGuideChapters,
        exercises,
        location,
    };
}

function validateAlignmentArray(value = [], label, academy) {
    if (!Array.isArray(value)) throw new Error(`${label}s must be an array.`);
    return value.map((item, index) => {
        const itemLabel = `${label} ${index + 1}`;
        assertExactKeys(
            item,
            itemLabel,
            academy ? ["chapter", "course", "title"] : ["chapter", "title"],
        );
        const chapter = requiredText(item.chapter, `${itemLabel} chapter`);
        if (!CHAPTER.test(chapter))
            throw new Error(
                `${itemLabel} chapter must be a quoted two-digit string.`,
            );
        const title = requiredText(item.title, `${itemLabel} title`);
        if (academy && !["RH124", "RH134"].includes(item.course))
            throw new Error(`${itemLabel} course must be RH124 or RH134.`);
        return academy
            ? { course: item.course, chapter, title }
            : { chapter, title };
    });
}

async function validateExercise(value, label, presentationId, declaringFile) {
    assertExactKeys(value, label, ["source", "title"]);
    const title = requiredText(value.title, `${label} title`);
    if (typeof value.source !== "string")
        throw new Error(
            `${label} source must be relative to its topic fragment.`,
        );
    const filename = path.posix.basename(value.source);
    if (
        filename.toLowerCase() ===
        presentationPdfFilename(presentationId).toLowerCase()
    )
        throw new Error(`${label} collides with the generated PDF filename.`);
    if (!EXERCISE_FILENAME.test(filename))
        throw new Error(
            `${label} source must end in a canonical -exercise.html filename.`,
        );
    const topicRoot = path.dirname(declaringFile);
    const exercisesRoot = path.join(topicRoot, "exercises");
    const lexical = path.resolve(topicRoot, value.source);
    assertContained(exercisesRoot, lexical, `${label} source`);
    const relative = path.relative(exercisesRoot, lexical);
    if ((await lstat(lexical).catch(() => null))?.isSymbolicLink())
        throw new Error(`${label} source cannot be a symlink.`);
    const sourceAbsolute = await assertExistingFileInside(
        exercisesRoot,
        relative,
        `${label} source`,
    );
    const htmlSource = validateExerciseResourceSource(
        await readFile(sourceAbsolute, "utf8"),
        `${label} source`,
    );
    return { title, filename, sourceAbsolute, htmlSource };
}

function mergeAlignment(values, identity, next, label) {
    const existing = values.get(identity);
    if (existing && existing.title !== next.title)
        throw new Error(`${label} ${identity} has conflicting titles.`);
    if (!existing) values.set(identity, next);
}

function assertParserErrors(data, root, label) {
    const errors = [];
    for (const markdown of new Set(Object.values(data.markdownFiles))) {
        for (const error of markdown.errors ?? [])
            errors.push(
                `${path.relative(root, markdown.filepath)}:${error.row + 1}: ${error.message}`,
            );
    }
    if (errors.length)
        throw new Error(
            `${label} has Slidev parser errors:\n- ${errors.join("\n- ")}`,
        );
}

function sourceLabel(slide, root) {
    return `${path.relative(root, slide.filepath)}:${slide.start + 1}`;
}

function assertAllowedKeys(value, label, allowed) {
    if (!isPlainObject(value)) throw new Error(`${label} must be an object.`);
    const unexpected = Object.keys(value).filter(
        (key) => !allowed.includes(key),
    );
    if (unexpected.length)
        throw new Error(
            `${label} has unsupported fields: ${unexpected.join(", ")}.`,
        );
}

function assertExactKeys(value, label, expected) {
    assertAllowedKeys(value, label, expected);
    const missing = expected.filter((key) => !Object.hasOwn(value, key));
    if (missing.length)
        throw new Error(`${label} is missing fields: ${missing.join(", ")}.`);
}

function requiredText(value, label) {
    if (
        typeof value !== "string" ||
        value.length === 0 ||
        value.trim() !== value
    )
        throw new Error(`${label} must be a non-empty trimmed string.`);
    return value;
}

function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepFreeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.freeze(value);
        for (const child of Object.values(value)) deepFreeze(child);
    }
    return value;
}

export function isCanonicalWeekId(value) {
    return typeof value === "string" && WEEK_ID.test(value);
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
    try {
        resolveIt230Accent(headmatter.themeConfig?.it230Accent);
    } catch (error) {
        throw new Error(`${entry}: ${error.message}`, { cause: error });
    }
}
