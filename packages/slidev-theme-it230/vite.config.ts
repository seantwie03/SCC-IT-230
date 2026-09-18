import { readFileSync } from "node:fs";

import type { Plugin } from "vite";

const favicon = readFileSync(new URL("./public/favicon.svg", import.meta.url));

function faviconPlugin(): Plugin {
    return {
        name: "it230-theme-favicon",
        configureServer(server) {
            server.middlewares.use((request, response, next) => {
                const pathname = new URL(request.url ?? "/", "http://localhost")
                    .pathname;
                if (!pathname.endsWith("/favicon.svg")) return next();

                response.statusCode = 200;
                response.setHeader("Content-Type", "image/svg+xml");
                response.end(favicon);
            });
        },
        generateBundle() {
            this.emitFile({
                type: "asset",
                fileName: "favicon.svg",
                source: favicon,
            });
        },
    };
}

/**
 * Slidev merges a `vite.config` from each of its roots, and the theme is one of
 * them, so these settings reach every deck in the repository.
 *
 * `strictPort` keeps local Slidev servers on their assigned ports. Vite normally
 * advances to another port when the requested port is occupied. Failing instead
 * makes a stale or conflicting process visible and prevents development and
 * agent-review servers from accumulating on unknown ports.
 *
 * `forwardConsole` prints the browser's errors and warnings in the terminal
 * running the deck. A component that fails to render does so in the browser, so
 * without this the dev server stays silent while the slide goes blank. Vite
 * otherwise enables this only when it detects that an AI agent started it, which
 * would leave a maintainer with less information than an agent gets.
 */
export default {
    plugins: [faviconPlugin()],
    server: {
        forwardConsole: {
            logLevels: ["error", "warn"],
            unhandledErrors: true,
        },
        strictPort: true,
    },
};
