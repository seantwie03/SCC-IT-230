import assert from "node:assert/strict";
import test from "node:test";

import { isSequenceEndCueVisible } from "../setup/sequence-end-cue.ts";

function clicks(current, total, options = {}) {
    return {
        clicksStart: options.clicksStart ?? 0,
        current,
        isMounted: options.isMounted ?? true,
        total,
    };
}

test("shows the sequence cue on the final click in the main slide", () => {
    assert.equal(isSequenceEndCueVisible(clicks(2, 2), "slide"), true);
});

test("keeps the sequence cue hidden before the final click", () => {
    assert.equal(isSequenceEndCueVisible(clicks(1, 2), "slide"), false);
});

test("keeps the sequence cue hidden when there is no click sequence", () => {
    assert.equal(isSequenceEndCueVisible(clicks(0, 0), "slide"), false);
});

test("shows the sequence cue in presenter rendering too", () => {
    assert.equal(isSequenceEndCueVisible(clicks(2, 2), "presenter"), true);
});

test("uses the whole slide sequence instead of a component-local click offset", () => {
    assert.equal(
        isSequenceEndCueVisible(clicks(2, 2, { clicksStart: 2 }), "slide"),
        true,
    );
});

test("keeps the sequence cue out of non-current-slide rendering", () => {
    for (const context of ["overview", "previewNext"])
        assert.equal(isSequenceEndCueVisible(clicks(2, 2), context), false);
});

test("waits for Slidev to register the complete click sequence", () => {
    assert.equal(
        isSequenceEndCueVisible(
            clicks(2, 2, {
                isMounted: false,
            }),
            "slide",
        ),
        false,
    );
});
