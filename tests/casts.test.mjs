/**
 * What the cast processor must accept, reject, and leave alone.
 *
 * `check:casts` is the only gate between a recording and publication, so the
 * cases that matter are the ones where a file looks plausible and is not
 * publishable: no section headers to trim to, no sentinel marking where the
 * demonstration ended, a truncated event stream, or local shell identity that
 * the trim could not reach.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { processCast } from "../scripts/lib/casts.mjs";

const HEADER = '{"version":3,"term":{"cols":120,"rows":24}}';
const BORDER = "#".repeat(60);

function cast(...events) {
    return [HEADER, ...events.map((event) => JSON.stringify(event)), ""].join(
        "\n",
    );
}

/** A raw recording: one section header, some output, then the sentinel. */
function raw({ label = "1. Do a thing", sentinel = true } = {}) {
    const events = [
        [0.01, "o", "local prompt before the header"],
        [0.01, "o", BORDER],
        [0.01, "o", `    ${label}`],
        [0.01, "o", BORDER],
        [1, "o", "[student@servera ~]$ ls"],
        [1, "o", "file-a  file-b"],
    ];
    if (sentinel) events.push([1, "o", "# End"]);
    return cast(...events);
}

test("a well-formed raw recording processes cleanly", () => {
    const result = processCast(raw());
    assert.deepEqual(result.problems, []);
    assert.deepEqual(result.identity, []);
    assert.equal(result.markers, 1);
    assert.ok(result.trimmedLeading > 0, "the preamble should be trimmed");
    assert.ok(result.trimmedTrailing > 0, "the sentinel should be trimmed");
    assert.ok(!result.text.includes("# End"));
    assert.ok(!result.text.includes("local prompt before the header"));
});

test("the marker carries the section title", () => {
    const result = processCast(raw({ label: "2. Schedule it" }));
    const markers = result.text
        .split("\n")
        .filter((line) => line.includes('"m"'))
        .map((line) => JSON.parse(line)[2]);
    assert.deepEqual(markers, ["2. Schedule it"]);
});

test("reprocessing is idempotent and does not duplicate markers", () => {
    const once = processCast(raw());
    const twice = processCast(once.text);
    assert.deepEqual(twice.problems, []);
    assert.equal(twice.markers, once.markers);
    assert.equal(twice.text, once.text);
});

test("an already processed recording may omit the sentinel", () => {
    const processed = processCast(raw()).text;
    const again = processCast(processed);
    assert.deepEqual(again.problems, []);
    assert.ok(
        again.warnings.some((warning) => warning.includes("already processed")),
        "omitting the sentinel should be a note, not a failure",
    );
});

test("a raw recording with no sentinel is refused", () => {
    const result = processCast(raw({ sentinel: false }));
    assert.ok(result.problems.some((problem) => problem.includes("sentinel")));
});

test("a recording with no section headers is refused", () => {
    const result = processCast(
        cast([1, "o", "just output"], [1, "o", "# End"]),
    );
    assert.ok(
        result.problems.some((problem) =>
            problem.includes("no section headers"),
        ),
    );
});

test("a recording that begins part-way through a header is refused", () => {
    // Hand-trimmed recordings look like this: the opening border is gone, so
    // the preamble cannot be located and markers alone would make it look
    // processed while it still carried local identity.
    const result = processCast(
        cast(
            [0.01, "o", "    1. Already inside the block"],
            [0.01, "o", BORDER],
            [1, "o", "output"],
            [1, "o", "# End"],
        ),
    );
    assert.ok(
        result.problems.some((problem) => problem.includes("part-way")),
        `expected a part-way refusal, got ${JSON.stringify(result.problems)}`,
    );
});

test("a header split across coalesced events is still found", () => {
    // The terminal coalesces writes, so one event routinely holds the tail of
    // a padded line plus the border that follows it.
    const result = processCast(
        cast(
            [0.01, "o", "preamble"],
            [0.01, "o", `          ${BORDER}`],
            [0.01, "o", `    Split Header${" ".repeat(20)}${BORDER}`],
            [1, "o", "output"],
            [1, "o", "# End"],
        ),
    );
    assert.deepEqual(result.problems, []);
    assert.equal(result.markers, 1);
});

test("local shell identity that survives trimming is reported", () => {
    const result = processCast(
        cast(
            [0.01, "o", "preamble"],
            [0.01, "o", BORDER],
            [0.01, "o", "    1. Do a thing"],
            [0.01, "o", BORDER],
            [1, "o", "]3008;start=abc;machineid=deadbeef;user=someone\\"],
            [1, "o", "# End"],
        ),
    );
    assert.equal(result.problems.length, 0);
    assert.equal(result.identity.length, 1);
});

test("a malformed event stream is refused", () => {
    for (const [name, source] of [
        ["not a header", ["oops", '[1,"o","x"]', ""].join("\n")],
        [
            "wrong version",
            cast([1, "o", "x"]).replace('"version":3', '"version":2'),
        ],
        [
            "no terminal size",
            cast([1, "o", "x"]).replace(/,"term":[^}]*}}/, "}"),
        ],
        ["bad event shape", [HEADER, '["nope"]', ""].join("\n")],
        ["no events", [HEADER, ""].join("\n")],
    ]) {
        const result = processCast(source);
        assert.ok(
            result.problems.length > 0,
            `${name} should have been refused`,
        );
    }
});

test("a stray border run does not crash the processor", () => {
    // A command whose own output contains a long run of hashes would pair
    // wrongly. It must still fail or process, never throw.
    assert.doesNotThrow(() =>
        processCast(
            cast(
                [0.01, "o", BORDER],
                [0.01, "o", "    1. Do a thing"],
                [0.01, "o", BORDER],
                [1, "o", `echo ${BORDER}`],
                [1, "o", "# End"],
            ),
        ),
    );
});
