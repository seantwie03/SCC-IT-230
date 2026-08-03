/**
 * Serve the theme gallery deck for local browser and AI-assisted review.
 *
 * Run `pnpm run review:theme` from the repository root to start
 * `packages/slidev-theme-it230/example.md` on the reserved localhost port
 * 2121. Vite strict-port configuration makes the command fail when 2121 is
 * occupied instead of silently starting another server. Treat that failure as
 * a conflict to report; do not stop a process this command did not start.
 *
 * This wrapper accepts no arguments and does not enable Slidev remote access
 * or tunneling. The server remains active until interrupted and forwards
 * Slidev output and failures to the caller. Stop only this process after
 * review, leaving pre-existing development servers running.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { validateDeckAccent } from "./validate-accent.mjs";

if (process.argv.length > 2) {
    throw new Error("Theme review does not accept command-line arguments.");
}

const themeRoot = fileURLToPath(new URL("../", import.meta.url));
await validateDeckAccent(
    fileURLToPath(new URL("../example.md", import.meta.url)),
);
const child = spawn("slidev", ["example.md", "--port", "2121"], {
    cwd: themeRoot,
    shell: process.platform === "win32",
    stdio: "inherit",
});

const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => {
        if (signal)
            reject(new Error(`Slidev review stopped by signal ${signal}.`));
        else resolve(code ?? 1);
    });
});

if (exitCode !== 0) process.exitCode = exitCode;
