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
 * Keep local Slidev servers on their assigned ports.
 *
 * Vite normally advances to another port when the requested port is occupied.
 * Failing instead makes a stale or conflicting process visible and prevents
 * development and agent-review servers from accumulating on unknown ports.
 */
export default {
    plugins: [faviconPlugin()],
    server: {
        strictPort: true,
    },
};
