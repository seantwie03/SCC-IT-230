import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parser } from "@slidev/cli";

import { resolveIt230Accent } from "../setup/accent.ts";

export async function validateDeckAccent(entry) {
    const absoluteEntry = path.resolve(entry);
    const source = await readFile(absoluteEntry, "utf8");
    const deck = parser.parseSync(source, absoluteEntry);
    const configuredAccent =
        deck.slides[0]?.frontmatter?.themeConfig?.it230Accent;

    try {
        return resolveIt230Accent(configuredAccent);
    } catch (error) {
        throw new Error(`${absoluteEntry}: ${error.message}`, { cause: error });
    }
}

const executedDirectly =
    process.argv[1] &&
    import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (executedDirectly) {
    if (process.argv.length !== 3)
        throw new Error("Usage: validate-accent.mjs <deck.md>");

    const accent = await validateDeckAccent(process.argv[2]);
    const relativeEntry = path.relative(
        process.cwd(),
        path.resolve(process.argv[2]),
    );
    console.log(`${relativeEntry}: ${accent.name}`);
}
