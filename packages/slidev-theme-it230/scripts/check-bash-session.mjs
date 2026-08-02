import { spawn } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const themeRoot = fileURLToPath(new URL("../", import.meta.url));
const fixture = path.join(themeRoot, "tests", "fixtures", "bash-session.md");
const fixtureCacheRoot = path.join(path.dirname(fixture), "node_modules");

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

await run("node", ["--test", "tests/bash-session.test.mjs"]);

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "it230-bash-session-"));
const buildRoot = path.join(temporaryRoot, "build");

try {
    await run("slidev", [
        "build",
        fixture,
        "--out",
        buildRoot,
        "--without-notes",
    ]);

    const assetRoot = path.join(buildRoot, "assets");
    const modules = await Promise.all(
        (await readdir(assetRoot, { recursive: true }))
            .filter((file) => file.endsWith(".js"))
            .map((file) => readFile(path.join(assetRoot, file), "utf8")),
    );
    const builtModules = modules.join("\n");
    const transcriptModule = modules
        .filter((source) => source.includes("language-bash-session"))
        .join("\n");

    if (!transcriptModule)
        throw new Error("Slidev did not render the bash-session fixture.");
    if (!builtModules.includes("#1C754B"))
        throw new Error("Slidev did not render the terminal prompt green.");
    if (!builtModules.includes("#C30000"))
        throw new Error(
            "Slidev did not render the privileged terminal prompt red.",
        );
    if (!builtModules.includes("#25252B"))
        throw new Error(
            "Slidev did not render the normal terminal foreground.",
        );
    if (!builtModules.includes("#613583"))
        throw new Error(
            "Slidev did not render Bash operators with the theme syntax palette.",
        );
    if (!builtModules.includes("#007184"))
        throw new Error(
            "Slidev did not render Bash strings with the theme syntax palette.",
        );
} finally {
    await Promise.all([
        rm(temporaryRoot, { force: true, recursive: true }),
        rm(fixtureCacheRoot, { force: true, recursive: true }),
    ]);
}
