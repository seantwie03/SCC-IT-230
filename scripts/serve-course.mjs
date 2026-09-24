import { fileURLToPath } from "node:url";

import { userArguments, validateFocusedEntry } from "./lib/arguments.mjs";
import { siteConfiguration } from "./lib/config.mjs";
import { serveCourseSite, serveFocusedDeck } from "./lib/development.mjs";
import { SHOWCASE_SLOT_ALIASES } from "./lib/showcase-slots.mjs";

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
    await serveCourseSite({
        root,
        /*
         * The published course must supply every showcase example, so an alias
         * that has been moved to a slide that no longer exists fails here
         * rather than quietly rendering a gap.
         */
        showcaseSlotAliases: SHOWCASE_SLOT_ALIASES,
        ...siteConfiguration(),
        ...settings,
    });
}
