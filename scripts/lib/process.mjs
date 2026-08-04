import { spawn } from "node:child_process";

export function run(command, args, options = {}) {
    const child = spawn(command, args, {
        shell: process.platform === "win32",
        stdio: "inherit",
        ...options,
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
