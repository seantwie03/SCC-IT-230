import { readFile } from "node:fs/promises";

const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

const expectedNode = manifest.engines.node;
const expectedNodeMajor = expectedNode.replace(/\.x$/, "");
const expectedPnpm = manifest.packageManager.replace(/^pnpm@/, "");
const actualNode = process.versions.node;
const actualNodeMajor = actualNode.split(".")[0];
const userAgent = process.env.npm_config_user_agent ?? "";
const actualPnpm = userAgent.match(/(?:^|\s)pnpm\/([^\s]+)/)?.[1];

const errors = [];

if (actualNodeMajor !== expectedNodeMajor) {
    errors.push(`Node.js ${expectedNode} is required; found ${actualNode}.`);
}

if (actualPnpm !== expectedPnpm) {
    errors.push(
        `pnpm ${expectedPnpm} is required; found ${actualPnpm ?? "an unknown version"}.`,
    );
}

if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
} else {
    console.log(
        `Toolchain verified: Node.js ${actualNode}, pnpm ${actualPnpm}`,
    );
}
