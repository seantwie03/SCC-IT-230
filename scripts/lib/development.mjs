import { spawn } from "node:child_process";
import { watch } from "node:fs";
import http from "node:http";
import path from "node:path";
import { Worker } from "node:worker_threads";

import { DEFAULT_PUBLIC_ORIGIN, DEFAULT_SITE_BASE } from "./config.mjs";
import { CANONICAL_WEEK_FILENAME } from "./presentations.mjs";
import {
    canvasAuthoringRoute,
    presentationResourceRoute,
    weekOverviewRoute,
    withSiteBase,
} from "./paths.mjs";
import { assertPortAvailable, listen } from "./server.mjs";

const LIVE_RELOAD_PATH = "/__it230_reload";
const IMPLEMENTATION_SOURCE_FILENAME = /\.(?:css|html|mjs|ts)$/;
const WORKER_TIMEOUT_MILLISECONDS = 30_000;
const LIVE_RELOAD_SCRIPT = `<script>
            new EventSource("${LIVE_RELOAD_PATH}").onmessage = () => location.reload();
        </script>`;

export async function createCourseSiteDevServer({
    root,
    courseRoot = "course",
    siteBase = DEFAULT_SITE_BASE,
    publicOrigin = DEFAULT_PUBLIC_ORIGIN,
    onReloadError = () => {},
    workerTimeoutMilliseconds = WORKER_TIMEOUT_MILLISECONDS,
}) {
    const absoluteCourseRoot = path.resolve(root, courseRoot);
    const clients = new Set();
    const renderAbortController = new AbortController();
    const renderOptions = {
        signal: renderAbortController.signal,
        timeoutMilliseconds: workerTimeoutMilliseconds,
    };
    let current;
    try {
        current = await loadCourseSite(
            { root, courseRoot, siteBase, publicOrigin },
            renderOptions,
        );
    } catch (error) {
        renderAbortController.abort();
        throw error;
    }
    let reloadTimer;
    let reloadQueue = Promise.resolve();
    let disposed = false;
    let contentWatchers = [];

    const broadcastReload = () => {
        for (const client of clients) client.write("data: reload\n\n");
    };
    const refresh = async () => {
        try {
            const next = await loadCourseSite(
                { root, courseRoot, siteBase, publicOrigin },
                renderOptions,
            );
            if (disposed) return;
            current = next;
            replaceContentWatchers(
                next.sourceFiles,
                next.implementationDirectories,
            );
            broadcastReload();
            console.log("Course-site sources reloaded.");
        } catch (error) {
            if (disposed) return;
            onReloadError(error);
            console.error(
                `Course-site reload failed; serving the last valid version.\n${error.stack ?? error.message}`,
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

    const reportWatcherError = (error) =>
        console.error(`Course-site watcher failed: ${error.message}`);
    const createWatcher = (
        directory,
        sourceFiles,
        implementationDirectories,
    ) => {
        const implementationDirectory =
            implementationDirectories.has(directory);
        const watcher = watch(
            directory,
            { recursive: implementationDirectory },
            (_event, filename) => {
                if (!filename) return;
                const changed = path.resolve(directory, filename.toString());
                if (
                    sourceFiles.has(changed) ||
                    (implementationDirectory &&
                        IMPLEMENTATION_SOURCE_FILENAME.test(
                            filename.toString(),
                        )) ||
                    (directory === absoluteCourseRoot &&
                        CANONICAL_WEEK_FILENAME.test(filename.toString()))
                )
                    scheduleReload();
            },
        );
        watcher.on("error", reportWatcherError);
        return watcher;
    };
    const replaceContentWatchers = (files, implementationDirectoryPaths) => {
        for (const watcher of contentWatchers) watcher.close();
        const sourceFiles = new Set(files.map((file) => path.resolve(file)));
        const implementationDirectories = new Set(
            implementationDirectoryPaths.map((directory) =>
                path.resolve(directory),
            ),
        );
        const directories = new Set([
            absoluteCourseRoot,
            ...[...sourceFiles].map((file) => path.dirname(file)),
            ...implementationDirectories,
        ]);
        contentWatchers = [...directories].map((directory) =>
            createWatcher(directory, sourceFiles, implementationDirectories),
        );
    };
    replaceContentWatchers(
        current.sourceFiles,
        current.implementationDirectories,
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
        if (
            pathname === current.siteBase ||
            pathname === `${current.siteBase}index.html`
        ) {
            respond(
                response,
                200,
                "text/html; charset=utf-8",
                current.landingPage,
                request.method,
            );
            return;
        }
        if (pathname === `${current.siteBase}site.css`) {
            respond(
                response,
                200,
                "text/css; charset=utf-8",
                current.styles,
                request.method,
            );
            return;
        }
        const weekPage = current.weekPages.get(pathname);
        if (weekPage) {
            respond(
                response,
                200,
                "text/html; charset=utf-8",
                weekPage,
                request.method,
            );
            return;
        }
        const resourcePage = current.resourcePages.get(pathname);
        if (resourcePage) {
            respond(
                response,
                200,
                "text/html; charset=utf-8",
                resourcePage,
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
        renderAbortController.abort();
        for (const watcher of contentWatchers) watcher.close();
        for (const client of clients) client.end();
        clients.clear();
    };
    server.once("close", dispose);
    return { dispose, server };
}

export async function serveCourseSite(options) {
    await assertPortAvailable(options.port);
    const { dispose, server } = await createCourseSiteDevServer(options);
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

async function loadCourseSite(options, renderOptions) {
    const { artifacts, implementationDirectories, sourceFiles } =
        await renderInFreshWorker(options, renderOptions);
    const weekPages = new Map();
    const resourcePages = new Map();
    for (const week of artifacts.weeks) {
        const rendered = addLiveReload(week.page);
        const route = withSiteBase(
            artifacts.siteBase,
            weekOverviewRoute(week.id),
        );
        weekPages.set(route, rendered);
        weekPages.set(`${route}index.html`, rendered);
        const canvasPage = addLiveReload(week.canvasPage);
        const canvasRoute = withSiteBase(
            artifacts.siteBase,
            canvasAuthoringRoute(week.id),
        );
        weekPages.set(canvasRoute, canvasPage);
        weekPages.set(`${canvasRoute}index.html`, canvasPage);
        for (const resource of week.resources)
            resourcePages.set(
                withSiteBase(
                    artifacts.siteBase,
                    presentationResourceRoute(week.id, resource.filename),
                ),
                addLiveReload(resource.html),
            );
    }
    return {
        landingPage: addLiveReload(artifacts.landingPage),
        implementationDirectories,
        resourcePages,
        siteBase: artifacts.siteBase,
        styles: artifacts.styles,
        sourceFiles,
        weekPages,
    };
}

export function renderInFreshWorker(
    options,
    { signal, timeoutMilliseconds = WORKER_TIMEOUT_MILLISECONDS } = {},
) {
    if (!Number.isInteger(timeoutMilliseconds) || timeoutMilliseconds <= 0)
        throw new TypeError(
            "Course-site worker timeout must be a positive integer.",
        );
    if (signal?.aborted)
        return Promise.reject(courseSiteWorkerCancellationError());
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL("./site-artifacts-worker.mjs", import.meta.url),
            { workerData: options },
        );
        let settled = false;
        const cleanup = () => {
            clearTimeout(timeout);
            signal?.removeEventListener("abort", cancel);
            worker.off("message", receive);
            worker.off("error", fail);
            worker.off("exit", exit);
        };
        const settle = (callback, value) => {
            if (settled) return;
            settled = true;
            cleanup();
            void worker.terminate();
            callback(value);
        };
        const receive = (message) => {
            if (message.error) {
                const error = new Error(message.error.message);
                error.stack = message.error.stack;
                settle(reject, error);
            } else settle(resolve, message);
        };
        const fail = (error) => settle(reject, error);
        const exit = (code) =>
            settle(
                reject,
                new Error(
                    code === 0
                        ? "Course-site renderer exited without producing artifacts."
                        : `Course-site renderer exited with code ${code}.`,
                ),
            );
        const cancel = () =>
            settle(reject, courseSiteWorkerCancellationError());
        const timeout = setTimeout(
            () =>
                settle(
                    reject,
                    new Error(
                        `Course-site renderer timed out after ${timeoutMilliseconds} ms.`,
                    ),
                ),
            timeoutMilliseconds,
        );
        worker.once("message", receive);
        worker.once("error", fail);
        worker.once("exit", exit);
        signal?.addEventListener("abort", cancel, { once: true });
    });
}

function courseSiteWorkerCancellationError() {
    const error = new Error("Course-site rendering was cancelled.");
    error.name = "AbortError";
    return error;
}

function addLiveReload(html) {
    const marker = "</body>";
    const index = html.lastIndexOf(marker);
    if (index < 0)
        throw new Error("A live-reloaded HTML document must contain </body>.");
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
