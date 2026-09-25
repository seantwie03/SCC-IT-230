import { defineMermaidSetup } from "@slidev/types";
import mermaid from "mermaid/dist/mermaid.esm.mjs";

/**
 * Register the icon pack that Mermaid's icon shapes draw from.
 *
 * Mermaid resolves an `icon` shape against the packs registered before a
 * diagram renders, so this runs as a side effect of the setup hook rather than
 * through the returned configuration. The pack is the installed package rather
 * than a CDN fetch, so decks render identically offline, in the production
 * build, and in the review browser.
 *
 * The loader is a dynamic import so that Vite splits the 1.1 MB icon set into
 * its own chunk, which only a deck that actually draws an icon shape loads.
 *
 * Carbon (Apache-2.0) carries the hardware vocabulary this course needs, such
 * as `bare-metal-server`, `firewall`, `router`, `switch-layer-3`, and `cloud`.
 * Reference an icon as `carbon:name`:
 *
 *     A@{ icon: "carbon:bare-metal-server", form: "square", label: "Web server" }
 */
export default defineMermaidSetup(() => {
    mermaid.registerIconPacks([
        {
            loader: () =>
                import("@iconify-json/carbon/icons.json").then(
                    (module) => module.default,
                ),
            name: "carbon",
        },
    ]);

    return {
        theme: "default",
    };
});
