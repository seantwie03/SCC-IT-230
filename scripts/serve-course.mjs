import path from "node:path";
import { fileURLToPath } from "node:url";

import { userArguments, validateFocusedEntry } from "./lib/arguments.mjs";
import { serveFocusedDeck, serveLandingPage } from "./lib/development.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const [mode, ...rawArgs] = process.argv.slice(2);
const args = userArguments(rawArgs);
const settings =
    mode === "dev"
        ? { port: 3030, label: "Maintainer development" }
        : mode === "review"
          ? { port: 3131, label: "Agent review" }
          : undefined;
if (!settings) throw new Error("IT230_SERVER_MODE must be dev or review.");

if (args.length > 1)
    throw new Error(
        `${settings.label} accepts no argument or one course entry.`,
    );
if (args.length === 1) {
    const entry = await validateFocusedEntry(root, args[0]);
    await serveFocusedDeck({ entry, root, port: settings.port });
} else {
    await serveLandingPage({
        registryPath: path.join(root, "slides.config.mjs"),
        root,
        ...settings,
    });
}
