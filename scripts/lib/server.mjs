import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import path from "node:path";

import { assertContained, validateSiteBase } from "./paths.mjs";

const CONTENT_TYPES = new Map([
    [".css", "text/css; charset=utf-8"],
    [".gif", "image/gif"],
    [".html", "text/html; charset=utf-8"],
    [".jpeg", "image/jpeg"],
    [".jpg", "image/jpeg"],
    [".js", "text/javascript; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
    [".mjs", "text/javascript; charset=utf-8"],
    [".png", "image/png"],
    [".svg", "image/svg+xml"],
    [".txt", "text/plain; charset=utf-8"],
    [".vtt", "text/vtt; charset=utf-8"],
    [".webm", "video/webm"],
    [".woff", "font/woff"],
    [".woff2", "font/woff2"],
    [".xml", "application/xml; charset=utf-8"],
    [".zip", "application/zip"],
]);

export async function assertPortAvailable(port) {
    const probe = net.createServer();
    await new Promise((resolve, reject) => {
        probe.once("error", (error) => {
            if (error.code === "EADDRINUSE")
                reject(
                    new Error(`Reserved localhost port ${port} is occupied.`),
                );
            else reject(error);
        });
        probe.listen(port, "localhost", resolve);
    });
    await new Promise((resolve, reject) =>
        probe.close((error) => (error ? reject(error) : resolve())),
    );
}

export function createStaticServer(root, { siteBase = "/" } = {}) {
    const absoluteRoot = path.resolve(root);
    const base = validateSiteBase(siteBase);

    return http.createServer(async (request, response) => {
        try {
            if (!request.url || !["GET", "HEAD"].includes(request.method)) {
                respond(response, 405, "Method not allowed.\n");
                return;
            }
            const requestUrl = new URL(request.url, "http://localhost");
            if (!requestUrl.pathname.startsWith(base)) {
                respond(response, 404, "Not found.\n");
                return;
            }
            const served = await serveStaticFile({
                absoluteRoot,
                relativeUrl: requestUrl.pathname.slice(base.length),
                request,
                response,
            });
            if (!served) respond(response, 404, "Not found.\n");
        } catch (error) {
            respond(response, 500, `${error.message}\n`);
        }
    });
}

/**
 * Serve one file from a directory, or report that it is not there.
 *
 * Extracted so the course-site development server can hand a request to a
 * directory of generated files without reimplementing the path checks that
 * keep a request inside its root. It responds only when it has something to
 * send, or when the request itself is malformed; the caller decides what a
 * miss means.
 *
 * Returns true when the response has been written.
 */
export async function serveStaticFile({
    absoluteRoot,
    relativeUrl,
    request,
    response,
}) {
    let decoded;
    try {
        decoded = decodeURIComponent(relativeUrl);
    } catch {
        respond(response, 400, "Invalid URL encoding.\n");
        return true;
    }
    if (decoded.includes("\\") || decoded.split("/").includes("..")) {
        respond(response, 400, "Invalid path.\n");
        return true;
    }
    if (decoded === "" || decoded.endsWith("/")) decoded += "index.html";

    const lexical = path.resolve(absoluteRoot, decoded);
    assertContained(absoluteRoot, lexical, "served file");

    let resolved;
    let info;
    try {
        [resolved, info] = await Promise.all([
            realpath(lexical),
            stat(lexical),
        ]);
        assertContained(await realpath(absoluteRoot), resolved, "served file");
    } catch {
        return false;
    }
    if (!info.isFile()) return false;

    response.writeHead(200, {
        "Content-Length": info.size,
        "Content-Type":
            CONTENT_TYPES.get(path.extname(resolved).toLowerCase()) ??
            "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(resolved).pipe(response);
    return true;
}

export function listen(server, port, label) {
    return new Promise((resolve, reject) => {
        server.once("error", (error) => {
            if (error.code === "EADDRINUSE")
                reject(
                    new Error(`Reserved localhost port ${port} is occupied.`),
                );
            else reject(error);
        });
        server.listen(port, "localhost", () => {
            console.log(`${label}: http://localhost:${port}/`);
            resolve();
        });
    });
}

function respond(response, status, body) {
    if (response.headersSent) return;
    response.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
    });
    response.end(body);
}
