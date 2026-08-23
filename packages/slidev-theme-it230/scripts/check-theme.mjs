import { spawn } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { IT230_ACCENT_NAMES } from "../setup/accent.ts";
import { validateDeckAccent } from "./validate-accent.mjs";

const themeRoot = fileURLToPath(new URL("../", import.meta.url));
const fixtureRoot = path.join(themeRoot, "tests", "fixtures");
const fixtureCacheRoot = path.join(fixtureRoot, "node_modules");

function run(command, args) {
    const child = spawn(command, args, {
        cwd: themeRoot,
        shell: process.platform === "win32",
        stdio: "inherit",
    });

    return new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (signal)
                reject(new Error(`${command} stopped by signal ${signal}.`));
            else if (code === 0) resolve();
            else reject(new Error(`${command} exited with code ${code ?? 1}.`));
        });
    });
}

async function readBuiltModules(buildRoot) {
    const assetRoot = path.join(buildRoot, "assets");
    const modules = await Promise.all(
        (await readdir(assetRoot, { recursive: true }))
            .filter((file) => file.endsWith(".js"))
            .map((file) => readFile(path.join(assetRoot, file), "utf8")),
    );

    return modules.join("\n");
}

const tests = (await readdir(path.join(themeRoot, "tests")))
    .filter((file) => file.endsWith(".test.mjs"))
    .sort()
    .map((file) => path.join("tests", file));
await run("node", ["--test", ...tests]);

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-theme-"));

try {
    const bashFixture = path.join(fixtureRoot, "bash-session.md");
    const bashBuildRoot = path.join(temporaryRoot, "bash-session");
    await run("slidev", [
        "build",
        bashFixture,
        "--out",
        bashBuildRoot,
        "--without-notes",
    ]);

    const builtBashModules = await readBuiltModules(bashBuildRoot);
    if (!builtBashModules.includes("language-bash-session"))
        throw new Error("Slidev did not render the bash-session fixture.");

    const expectedSyntaxColors = [
        "#1C754B",
        "#C30000",
        "#25252B",
        "#613583",
        "#007184",
    ];
    for (const color of expectedSyntaxColors) {
        if (!builtBashModules.includes(color))
            throw new Error(`Slidev did not render expected color ${color}.`);
    }

    const [builtIndex, sourceFavicon, builtFavicon] = await Promise.all([
        readFile(path.join(bashBuildRoot, "index.html"), "utf8"),
        readFile(path.join(themeRoot, "public", "favicon.svg"), "utf8"),
        readFile(path.join(bashBuildRoot, "favicon.svg"), "utf8"),
    ]);
    if (!builtIndex.includes('href="./favicon.svg"'))
        throw new Error("Slidev did not use the shared theme favicon.");
    if (builtFavicon !== sourceFavicon)
        throw new Error("Slidev did not copy the shared theme favicon intact.");

    const accentFixture = await readFile(
        path.join(fixtureRoot, "accent.md"),
        "utf8",
    );
    const absoluteTheme = themeRoot.replaceAll("\\", "/");

    const allAccents = process.argv.slice(2).includes("--all-accents");
    const buildsToRun = [];

    for (const name of IT230_ACCENT_NAMES) {
        const deckSource = accentFixture
            .replace("theme: ../..", `theme: \"${absoluteTheme}\"`)
            .replace("it230Accent: purple", `it230Accent: ${name}`);
        const deckEntry = path.join(temporaryRoot, `${name}.md`);
        const buildRoot = path.join(temporaryRoot, `accent-${name}`);
        await writeFile(deckEntry, deckSource);

        const accent = await validateDeckAccent(deckEntry);
        if (accent.name !== name)
            throw new Error(`Validated ${accent.name} instead of ${name}.`);

        if (allAccents || name === "blue") {
            buildsToRun.push(
                run("slidev", [
                    "build",
                    deckEntry,
                    "--out",
                    buildRoot,
                    "--without-notes",
                ]),
            );
        }
    }

    await Promise.all(buildsToRun);

    const invalidEntry = path.join(temporaryRoot, "invalid.md");
    await writeFile(
        invalidEntry,
        accentFixture
            .replace("theme: ../..", `theme: \"${absoluteTheme}\"`)
            .replace("it230Accent: purple", "it230Accent: brown"),
    );

    await assertRejectsInvalidDeck(invalidEntry);
} finally {
    await Promise.all([
        rm(temporaryRoot, { force: true, recursive: true }),
        rm(fixtureCacheRoot, { force: true, recursive: true }),
    ]);
}

async function assertRejectsInvalidDeck(entry) {
    try {
        await validateDeckAccent(entry);
    } catch (error) {
        if (/Invalid themeConfig\.it230Accent/.test(error.message)) return;
        throw error;
    }

    throw new Error("Accent validation accepted an unsupported name.");
}
