import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const themeRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(themeRoot, "dist");
const outputDirectory = path.join(distRoot, "gallery");

if (path.relative(distRoot, outputDirectory) !== "gallery") {
    throw new Error(
        "Refusing to build the gallery outside the theme package dist directory.",
    );
}

await rm(outputDirectory, { force: true, recursive: true });

const outputFromTheme = path.relative(themeRoot, outputDirectory);
const child = spawn(
    "slidev",
    ["build", "example.md", "--out", outputFromTheme, "--without-notes"],
    {
        cwd: themeRoot,
        shell: process.platform === "win32",
        stdio: "inherit",
    },
);

const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => {
        if (signal)
            reject(new Error(`Slidev build stopped by signal ${signal}.`));
        else resolve(code ?? 1);
    });
});

if (exitCode !== 0) process.exitCode = exitCode;
