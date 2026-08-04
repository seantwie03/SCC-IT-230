import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { loadRegistry } from "./registry.mjs";
import { assertPortAvailable, listen } from "./server.mjs";

const LIVE_RELOAD_PATH = "/__it230_reload";
const LIVE_RELOAD_SCRIPT = `<script>
            new EventSource("${LIVE_RELOAD_PATH}").onmessage = () => location.reload();
        </script>`;

export async function createLandingPageDevServer({
    registryPath,
    root,
    registryOptions = {},
}) {
    const siteRoot = path.join(root, "site");
    const watchedSiteFiles = new Set([
        "index.html",
        "render-template.mjs",
        "styles.css",
    ]);
    const clients = new Set();
    let current = await loadLandingPage({
        registryPath,
        root,
        registryOptions,
    });
    let reloadTimer;
    let reloadQueue = Promise.resolve();
    let disposed = false;

    const broadcastReload = () => {
        for (const client of clients) client.write("data: reload\n\n");
    };
    const refresh = async () => {
        try {
            const next = await loadLandingPage({
                registryPath,
                root,
                registryOptions,
            });
            if (disposed) return;
            current = next;
            broadcastReload();
            console.log("Landing-page sources reloaded.");
        } catch (error) {
            console.error(
                `Landing-page reload failed; serving the last valid version.\n${error.stack ?? error.message}`,
            );
        }
    };
    const scheduleReload = () => {
        if (disposed) return;
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
            reloadQueue = reloadQueue.then(refresh, refresh);
        }, 50);
    };

    const registryDirectory = path.dirname(registryPath);
    const registryFilename = path.basename(registryPath);
    const watchers = [
        watch(registryDirectory, (_event, filename) => {
            if (filename?.toString() === registryFilename) scheduleReload();
        }),
        watch(siteRoot, (_event, filename) => {
            if (watchedSiteFiles.has(filename?.toString())) scheduleReload();
        }),
    ];
    for (const watcher of watchers)
        watcher.on("error", (error) =>
            console.error(`Landing-page watcher failed: ${error.message}`),
        );

    const server = http.createServer((request, response) => {
        if (!request.url || !["GET", "HEAD"].includes(request.method)) {
            respond(
                response,
                405,
                "text/plain; charset=utf-8",
                "Method not allowed.\n",
            );
            return;
        }

        const pathname = new URL(request.url, "http://localhost").pathname;
        if (pathname === LIVE_RELOAD_PATH) {
            if (request.method === "HEAD") {
                respond(
                    response,
                    405,
                    "text/plain; charset=utf-8",
                    "Method not allowed.\n",
                );
                return;
            }
            response.writeHead(200, {
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                "Content-Type": "text/event-stream",
                "X-Content-Type-Options": "nosniff",
            });
            response.write(": connected\n\n");
            clients.add(response);
            request.once("close", () => clients.delete(response));
            return;
        }
        if (pathname === "/" || pathname === "/index.html") {
            respond(
                response,
                200,
                "text/html; charset=utf-8",
                current.html,
                request.method,
            );
            return;
        }
        if (pathname === "/site.css") {
            respond(
                response,
                200,
                "text/css; charset=utf-8",
                current.styles,
                request.method,
            );
            return;
        }
        respond(response, 404, "text/plain; charset=utf-8", "Not found.\n");
    });

    const dispose = () => {
        if (disposed) return;
        disposed = true;
        clearTimeout(reloadTimer);
        for (const watcher of watchers) watcher.close();
        for (const client of clients) client.end();
        clients.clear();
    };
    server.once("close", dispose);
    return { dispose, server };
}

export async function serveLandingPage(options) {
    await assertPortAvailable(options.port);
    const { dispose, server } = await createLandingPageDevServer(options);
    const stop = () => {
        dispose();
        server.close();
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    try {
        await listen(server, options.port, options.label);
        await new Promise((resolve) => server.once("close", resolve));
    } finally {
        process.off("SIGINT", stop);
        process.off("SIGTERM", stop);
        dispose();
    }
}

export async function serveFocusedDeck({ entry, root, port }) {
    await assertPortAvailable(port);
    const child = spawn("slidev", [entry, "--port", String(port)], {
        cwd: root,
        shell: process.platform === "win32",
        stdio: "inherit",
    });
    const forward = (signal) => {
        if (!child.killed) child.kill(signal);
    };
    process.once("SIGINT", () => forward("SIGINT"));
    process.once("SIGTERM", () => forward("SIGTERM"));
    const code = await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("exit", (exitCode, signal) => {
            if (signal && !["SIGINT", "SIGTERM"].includes(signal))
                reject(new Error(`Slidev stopped by signal ${signal}.`));
            else resolve(exitCode ?? 0);
        });
    });
    if (code !== 0) process.exitCode = code;
}

async function loadLandingPage({ registryPath, root, registryOptions }) {
    const rendererPath = path.join(root, "site", "render-template.mjs");
    const [registry, rendererInfo, styles] = await Promise.all([
        loadRegistry(registryPath, { ...registryOptions, root }),
        stat(rendererPath),
        readFile(path.join(root, "site", "styles.css"), "utf8"),
    ]);
    const rendererUrl = pathToFileURL(rendererPath);
    rendererUrl.searchParams.set("mtime", String(rendererInfo.mtimeMs));
    const { renderLandingPage } = await import(rendererUrl.href);
    const html = addLiveReload(await renderLandingPage(registry, "/"));
    return { html, styles };
}

function addLiveReload(html) {
    const marker = "</body>";
    const index = html.lastIndexOf(marker);
    if (index < 0)
        throw new Error("The landing page must contain a closing body tag.");
    return `${html.slice(0, index)}${LIVE_RELOAD_SCRIPT}\n    ${html.slice(index)}`;
}

function respond(response, status, contentType, body, method = "GET") {
    response.writeHead(status, {
        "Cache-Control": "no-store",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
    });
    if (method === "HEAD") response.end();
    else response.end(body);
}
