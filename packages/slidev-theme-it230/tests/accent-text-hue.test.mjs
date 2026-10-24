import assert from "node:assert/strict";
import test from "node:test";

import {
    IT230_ACCENT_NAMES,
    IT230_ACCENTS,
    resolveHueTextColor,
} from "../setup/accent.ts";

test("draws every palette hue in that hue's contrast-checked text color", () => {
    for (const name of IT230_ACCENT_NAMES) {
        assert.equal(resolveHueTextColor(name), IT230_ACCENTS[name].text);
    }
});

test("rejects a hue outside the palette and names the choices", () => {
    assert.throws(
        () => resolveHueTextColor("brown"),
        /Invalid hue "brown"\. Choose one of: blue, teal, green/,
    );
    assert.throws(() => resolveHueTextColor("Blue"), /Invalid hue "Blue"/);
    assert.throws(() => resolveHueTextColor("#0461BE"), /Invalid hue/);
});

test("rejects a missing or non-string hue", () => {
    assert.throws(
        () => resolveHueTextColor(undefined),
        /Invalid hue undefined/,
    );
    assert.throws(() => resolveHueTextColor(3), /Invalid hue 3/);
});
