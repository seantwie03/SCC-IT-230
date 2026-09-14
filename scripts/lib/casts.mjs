import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * A full-width run of `#` is how `kitty-demo.sh` draws a section-header
 * border. Nothing else in an exercise prints that many consecutive hashes, so
 * the border doubles as a structural landmark for both trimming and markers.
 */
const BORDER = /#{40,}/g;

/** The driver types this once the command file is exhausted. */
const SENTINEL = "# End";

/**
 * systemd stamps every prompt and every command with an OSC 3008 context
 * sequence carrying the machine ID, the username, and the hostname. It hooks
 * the shell in two places, `PROMPT_COMMAND` and `PS0`, and the driver unsets
 * both before recording. Any occurrence here means that preamble regressed.
 */
const IDENTITY = [
    ["systemd OSC context (carries machineid, user, hostname)", /\]3008;/],
];

/** Select Graphic Rendition sequences, stripped before reading a label. */
const ANSI = /\[[0-9;]*m/g;

export async function discoverCasts(courseRoot) {
    const found = [];
    const walk = async (directory) => {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const next = path.join(directory, entry.name);
            if (entry.isDirectory()) await walk(next);
            else if (entry.name.endsWith(".cast")) found.push(next);
        }
    };
    await walk(courseRoot);
    return found.sort();
}

function parse(source) {
    const lines = source.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) throw new Error("The recording is empty.");
    const [header, ...rest] = lines;
    return { header, body: rest.map((line) => JSON.parse(line)) };
}

/**
 * Read a marker label out of a header block.
 *
 * `print_line_and_wrap` starts each line at column one by padding the previous
 * one out to the terminal width rather than emitting a newline, so a header
 * block arrives as a single long line. A run of three or more spaces is
 * therefore the real line break, and the first segment is the section title;
 * the rest is its detail.
 */
function readLabel(text) {
    const flat = text.replace(ANSI, "").replace(/[\r\n]+/g, "   ");
    for (const segment of flat.split(/\s{3,}/)) {
        const trimmed = segment.trim();
        if (trimmed !== "" && !/#{40,}/.test(trimmed)) return trimmed;
    }
    return "Section";
}

/**
 * Join every output event into one stream, remembering which event each
 * character came from.
 *
 * Borders cannot be found event by event. `print_line_and_wrap` pads each line
 * to the terminal width, and the terminal coalesces writes, so one event
 * routinely holds the tail of a padded line plus the border that follows it.
 * Positions in the joined text are the only reliable way to pair an opening
 * border with its closing one.
 */
function outputStream(events) {
    const spans = [];
    let text = "";
    for (const [index, event] of events.entries()) {
        if (event[1] !== "o") continue;
        spans.push({
            start: text.length,
            end: text.length + event[2].length,
            index,
        });
        text += event[2];
    }
    return { text, spans };
}

/**
 * Locate every section-header block.
 *
 * A block is an opening border, the header text, then a closing border. A
 * recording trimmed by hand may be missing its very first opening border, so
 * an odd number of borders is read as starting mid-block rather than as
 * corruption.
 */
function headerBlocks(events) {
    const { text, spans } = outputStream(events);
    const eventAt = (offset) =>
        spans.find((span) => offset >= span.start && offset < span.end)
            ?.index ?? null;

    const borders = [...text.matchAll(BORDER)].map((match) => [
        match.index,
        match.index + match[0].length,
    ]);

    const blocks = [];
    let cursor = 0;
    if (borders.length % 2 === 1) {
        blocks.push({
            open: null,
            close: eventAt(borders[0][1] - 1),
            label: readLabel(text.slice(0, borders[0][0])),
        });
        cursor = 1;
    }
    for (; cursor + 1 < borders.length; cursor += 2)
        blocks.push({
            open: eventAt(borders[cursor][0]),
            close: eventAt(borders[cursor + 1][1] - 1),
            label: readLabel(
                text.slice(borders[cursor][1], borders[cursor + 1][0]),
            ),
        });

    return blocks;
}

export function processCast(source) {
    const { header, body } = parse(source);
    const warnings = [];
    const problems = [];

    problems.push(...shapeProblems(header, body));

    // A raw recording still carries its sentinel; a processed one cannot,
    // because trimming removes it deliberately. Marker events are therefore
    // what tells the two apart, and the distinction has to be read from the
    // input, before this function adds markers of its own.
    const wasProcessed = body.some((event) => event[1] === "m");

    // Markers are rebuilt from scratch so reprocessing cannot duplicate them.
    let events = body.filter((event) => event[1] !== "m");

    let blocks = headerBlocks(events);
    if (blocks.length === 0)
        problems.push(
            "no section headers found, so it cannot be trimmed or marked",
        );

    // Trim the preamble: the font change, the SSH, and the local prompt that
    // precede the first section header.
    let trimmedLeading = 0;
    if (blocks.length > 0 && blocks[0].open === null)
        // Trimming is skipped here, but markers would still be added, which
        // would make an untrimmed recording look processed while it still
        // carries its preamble. Refuse it instead.
        problems.push(
            "begins part-way through a section header, so its preamble cannot " +
                "be trimmed; re-record it",
        );
    else if (blocks.length > 0 && blocks[0].open > 0) {
        trimmedLeading = blocks[0].open;
        events = events.slice(trimmedLeading);
        events[0] = [0, ...events[0].slice(1)];
    }

    // Trim the sentinel and everything after it. It is the instructor's cue
    // that the file is exhausted, not course content. Matching the last
    // occurrence makes the short string collision proof.
    let trimmedTrailing = 0;
    const sentinel = events.reduce(
        (last, event, index) =>
            event[1] === "o" && event[2].includes(SENTINEL) ? index : last,
        -1,
    );
    if (sentinel >= 0) {
        trimmedTrailing = events.length - sentinel;
        events = events.slice(0, sentinel);
    } else if (wasProcessed)
        warnings.push(
            `already processed, so no ${JSON.stringify(SENTINEL)} sentinel remains`,
        );
    else
        problems.push(
            `no ${JSON.stringify(SENTINEL)} sentinel found, so the end of the ` +
                "demonstration cannot be located",
        );

    // Identity is judged on what would actually be published, so this runs
    // after trimming: the local prompt drawn on the way out of the session is
    // removed by the tail trim, while one drawn mid-exercise is not and must
    // fail the build.
    const identity = [];
    for (const [description, pattern] of IDENTITY)
        if (events.some((event) => event[1] === "o" && pattern.test(event[2])))
            identity.push(description);

    // A marker carries no elapsed time of its own, so inserting one after a
    // closing border leaves every following interval untouched.
    blocks = headerBlocks(events);
    const closes = new Map(blocks.map((block) => [block.close, block.label]));
    const marked = [];
    for (const [index, event] of events.entries()) {
        marked.push(event);
        if (closes.has(index)) marked.push([0, "m", closes.get(index)]);
    }

    if (closes.size === 0 && blocks.length > 0)
        problems.push("no markers could be generated from its section headers");

    return {
        text: [
            header,
            ...marked.map((event) => JSON.stringify(event)),
            "",
        ].join("\n"),
        identity,
        problems,
        warnings,
        markers: closes.size,
        trimmedLeading,
        trimmedTrailing,
    };
}

/**
 * Check that a recording is a well-formed asciicast v3 before reading meaning
 * into it.
 *
 * A truncated or hand-edited file can still parse as JSON line by line while
 * describing nothing playable, and the publishing check should say so rather
 * than reporting that it found no headers.
 */
function shapeProblems(header, body) {
    const problems = [];
    let meta;
    try {
        meta = JSON.parse(header);
    } catch {
        return ["its first line is not an asciicast header"];
    }
    if (meta?.version !== 3)
        problems.push(`expected asciicast v3, found version ${meta?.version}`);
    if (
        !Number.isInteger(meta?.term?.cols) ||
        !Number.isInteger(meta?.term?.rows)
    )
        problems.push("its header does not declare a terminal size");

    const codes = new Set(["o", "i", "m", "r", "x"]);
    const malformed = body.findIndex(
        (event) =>
            !Array.isArray(event) ||
            event.length !== 3 ||
            typeof event[0] !== "number" ||
            !codes.has(event[1]) ||
            typeof event[2] !== "string",
    );
    if (malformed >= 0)
        problems.push(
            `event ${malformed + 1} is not a valid asciicast v3 event`,
        );

    if (body.length === 0) problems.push("it contains no events");
    return problems;
}
