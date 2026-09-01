/**
 * Run one command on an IT-230 lab host.
 *
 * Course authoring verifies commands, output, and exit codes against the live
 * lab rather than trusting ported material. This wrapper is the only approved
 * path to that lab: it accepts a host name from a fixed allowlist and refuses
 * everything else, so an approved command cannot reach an arbitrary host.
 *
 * Usage:
 *   pnpm lab -- servera hostname -f
 *   pnpm lab -- --tty servera set -o
 *
 * The wrapper supplies its own connection options and deliberately rejects
 * caller-supplied `ssh` flags in the host position. Options such as
 * `-o ProxyCommand=...` and `-J` can redirect a connection to an unlisted
 * host, so accepting them would defeat the allowlist.
 *
 * By default the remote command reads no standard input, because an inherited
 * stdin that never reaches end-of-file leaves `ssh` waiting forever. Pass
 * `--tty` to allocate a terminal and forward standard input instead. Use it
 * when piping a script into an interactive shell, and when lab output differs
 * between interactive and noninteractive shells.
 *
 * This restricts which host this machine connects to. It cannot restrict what
 * a command does once it runs on a lab host.
 */
import { spawn } from "node:child_process";

import { userArguments } from "./lib/arguments.mjs";

const LAB_HOSTS = ["workstation", "servera", "serverb", "serverc"];
const USAGE =
    "Usage: pnpm lab -- [--tty] <host> [command ...]\n" +
    `Lab hosts: ${LAB_HOSTS.join(", ")}`;

const args = userArguments(process.argv.slice(2));
let requestTty = false;
let index = 0;

if (args[index] === "--tty") {
    requestTty = true;
    index += 1;
}

const host = args[index];
const command = args.slice(index + 1);

if (host === undefined) throw new Error(`A lab host is required.\n${USAGE}`);

if (host.startsWith("-"))
    throw new Error(
        `The host position does not accept options, received ${host}. ` +
            `Connection options are supplied by this wrapper because options ` +
            `such as -o ProxyCommand and -J can reach an unlisted host.\n${USAGE}`,
    );

if (!LAB_HOSTS.includes(host))
    throw new Error(`${host} is not an IT-230 lab host.\n${USAGE}`);

const sshArguments = [
    "-o",
    "BatchMode=yes",
    "-o",
    "StrictHostKeyChecking=accept-new",
];

if (requestTty) sshArguments.push("-tt");
else sshArguments.push("-n");

sshArguments.push("--", host, ...command);

const child = spawn("ssh", sshArguments, {
    stdio: requestTty ? "inherit" : ["ignore", "inherit", "inherit"],
});
const forward = (signal) => {
    if (!child.killed) child.kill(signal);
};

process.once("SIGINT", () => forward("SIGINT"));
process.once("SIGTERM", () => forward("SIGTERM"));

child.once("error", (error) => {
    throw error;
});
child.once("exit", (code, signal) => {
    if (signal) process.exitCode = 1;
    else process.exitCode = code ?? 0;
});
