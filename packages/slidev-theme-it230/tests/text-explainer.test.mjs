import assert from "node:assert/strict";
import test from "node:test";

import {
    buildStates,
    renderedWidth,
    selectSize,
} from "../setup/text-explainer.ts";

const ATQ = ["student@servera:~$ atq", "1\tFri Sep  4 11:46:00 2026 a student"];

function marked(state) {
    return state.lines
        .flatMap((line) => line.segments)
        .filter((segment) => segment.active)
        .map((segment) => segment.text);
}

function candidates(state) {
    return state.lines
        .flatMap((line) => line.segments)
        .filter((segment) => segment.highlightable)
        .map((segment) => segment.text);
}

test("marks one literal per step, in click order", () => {
    const states = buildStates(ATQ, [
        { line: 2, text: "a", explanation: "The queue" },
        { line: 2, text: "student", explanation: "The user" },
    ]);

    assert.equal(states.length, 2);
    assert.deepEqual(marked(states[0]), ["a"]);
    assert.deepEqual(marked(states[1]), ["student"]);
});

test("reserves every step's range from the first state", () => {
    const states = buildStates(ATQ, [
        { line: 2, text: "a", explanation: "The queue" },
        { line: 2, text: "student", explanation: "The user" },
    ]);

    assert.deepEqual(candidates(states[0]), ["a", "student"]);
    assert.deepEqual(candidates(states[1]), ["a", "student"]);
});

test("selects a repeated literal by occurrence", () => {
    const cron = ["*/2 * * * * root /usr/bin/etc_backup.sh"];
    const states = buildStates(cron, [
        { text: "*/2", explanation: "Minutes" },
        { text: "*", occurrence: 2, explanation: "Hours" },
        { text: "*", occurrence: 3, explanation: "Day of month" },
    ]);

    assert.deepEqual(marked(states[1]), ["*"]);
    assert.equal(states[1].lines[0].segments[2].active, true);
});

test("rejects a literal that is ambiguous within one line", () => {
    assert.throws(
        () => buildStates(ATQ, [{ line: 2, text: "1", explanation: "Job" }]),
        /finds "1" 3 times in line 2; set occurrence/,
    );
});

test("rejects a literal that is ambiguous across lines", () => {
    // "student" is in the prompt line and again as the job owner, so a step
    // without a line has to say which one it means.
    assert.throws(
        () => buildStates(ATQ, [{ text: "student", explanation: "The user" }]),
        /finds "student" 2 times in the text; set occurrence/,
    );
});

test("rejects a literal that is not present", () => {
    assert.throws(
        () => buildStates(ATQ, [{ line: 2, text: "zzz", explanation: "?" }]),
        /cannot find "zzz" in line 2/,
    );
});

test("rejects an occurrence outside the match count", () => {
    assert.throws(
        () =>
            buildStates(ATQ, [
                { line: 2, text: "1", occurrence: 9, explanation: "Job" },
            ]),
        /occurrence must be between 1 and 3/,
    );
});

test("marks a whole line when a step carries no text", () => {
    const status = ["Active: active (waiting)", "Trigger: Fri 11:57"];
    const states = buildStates(status, [
        { line: 1, explanation: "The timer is waiting" },
    ]);

    assert.deepEqual(marked(states[0]), ["Active: active (waiting)"]);
});

test("counts lines from 1, matching occurrence", () => {
    const status = ["Active: active (waiting)", "Trigger: Fri 11:57"];
    const states = buildStates(status, [
        { line: 2, explanation: "When it next fires" },
    ]);

    assert.deepEqual(marked(states[0]), ["Trigger: Fri 11:57"]);
});

test("rejects a line number outside the text", () => {
    for (const line of [0, 3])
        assert.throws(
            () => buildStates(ATQ, [{ line, explanation: "?" }]),
            /line must be between 1 and 2/,
        );
});

test("requires a line for a whole-line step", () => {
    assert.throws(
        () => buildStates(ATQ, [{ explanation: "?" }]),
        /needs text, or a line to mark whole/,
    );
});

test("rejects overlapping ranges", () => {
    assert.throws(
        () =>
            buildStates(
                ["student@servera"],
                [
                    { text: "student@", explanation: "User" },
                    { text: "@servera", explanation: "Host" },
                ],
            ),
        /ranges on line 0 cannot overlap/,
    );
});

test("requires an explanation on every step", () => {
    assert.throws(
        () => buildStates(ATQ, [{ line: 2, text: "student", explanation: "" }]),
        /step 1 needs an explanation/,
    );
});

test("counts a tab as its advance to the next tab stop", () => {
    assert.equal(renderedWidth("1\tx"), 9);
    assert.equal(renderedWidth("12345678\tx"), 17);
    assert.equal(renderedWidth("plain"), 5);
});

test("sizes one short line large and a wide block small", () => {
    assert.equal(selectSize(["student@workstation:/etc$ ls -l"]), "lg");
    assert.equal(selectSize(ATQ), "md");
    assert.equal(
        selectSize([
            "Sep  4 11:37:00 servera atd[10208]: Starting job 1 (a0000101bea64d) for user 'student' (1000)",
        ]),
        "sm",
    );
    assert.equal(selectSize(Array(10).fill("short")), "sm");
});

test("keeps a lone line off the large size once it grows wide", () => {
    assert.equal(selectSize(["x".repeat(44)]), "lg");
    assert.equal(selectSize(["x".repeat(45)]), "md");
    assert.equal(selectSize(["x".repeat(65)]), "sm");
});
