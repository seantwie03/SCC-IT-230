import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
    accentCssVariables,
    IT230_ACCENT_NAMES,
    IT230_ACCENTS,
    resolveIt230Accent,
} from "../setup/accent.ts";
import { loadIt230LightTheme } from "../setup/it230-light-theme.ts";

const canvas = "#FAFAFB";
const canvasGradientEnd = "#F5F6F8";
const surface = "#FFFFFF";
const officialOrAdjustedFills = {
    blue: "#3584E4",
    green: "#3A944A",
    orange: "#ED5B00",
    pink: "#D56199",
    purple: "#9141AC",
    red: "#E62D42",
    slate: "#6F8396",
    teal: "#2190A4",
    yellow: "#BD8000",
};
const officialOrAdjustedText = {
    blue: "#0461BE",
    green: "#15732D",
    orange: "#B62200",
    pink: "#A2326C",
    purple: "#8939A4",
    red: "#C00023",
    slate: "#526678",
    teal: "#006E80",
    yellow: "#905300",
};

function relativeLuminance(hex) {
    const channels = [1, 3, 5]
        .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
        .map((value) =>
            value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        );

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
    const luminances = [relativeLuminance(first), relativeLuminance(second)];
    return (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05);
}

test("exposes the supported Adwaita accents in the documented order", () => {
    assert.deepEqual(IT230_ACCENT_NAMES, [
        "blue",
        "teal",
        "green",
        "yellow",
        "orange",
        "red",
        "pink",
        "purple",
        "slate",
    ]);
    assert.deepEqual(
        Object.fromEntries(
            IT230_ACCENT_NAMES.map((name) => [name, IT230_ACCENTS[name].fill]),
        ),
        officialOrAdjustedFills,
    );
});

test("uses blue by default and rejects every unsupported value", () => {
    assert.equal(resolveIt230Accent(), IT230_ACCENTS.blue);

    for (const invalid of [
        null,
        "",
        "Blue",
        "brown",
        "#3584e4",
        3,
        { name: "blue" },
    ]) {
        assert.throws(
            () => resolveIt230Accent(invalid),
            /Invalid themeConfig\.it230Accent/,
        );
    }
});

test("resolves accessible text, fill, and wash roles", () => {
    for (const name of IT230_ACCENT_NAMES) {
        const accent = resolveIt230Accent(name);
        const variables = accentCssVariables(accent);

        assert.equal(accent.name, name);
        assert.equal(accent.fill, officialOrAdjustedFills[name]);
        assert.equal(accent.text, officialOrAdjustedText[name]);
        assert.match(accent.wash, /^rgb\(\d+ \d+ \d+ \/ 14%\)$/);
        assert.deepEqual(Object.keys(variables).sort(), [
            "--it230-color-accent-fill",
            "--it230-color-accent-text",
            "--it230-color-accent-wash",
        ]);

        for (const background of [canvas, surface]) {
            assert.ok(
                contrastRatio(accent.text, background) >= 5.68,
                `${name} text does not reach 5.68:1 on ${background}`,
            );
        }

        for (const background of [canvas, canvasGradientEnd, surface]) {
            assert.ok(
                contrastRatio(accent.fill, background) >= 3,
                `${name} fill does not reach 3:1 on ${background}`,
            );
        }
    }
});

test("keeps status, syntax, terminal, text, and neutral colors independent", async () => {
    const css = await readFile(
        new URL("../styles/theme.css", import.meta.url),
        "utf8",
    );
    const syntaxBefore = await loadIt230LightTheme();

    assert.match(css, /--it230-color-text: #25252b;/);
    assert.match(css, /--it230-color-surface: #ffffff;/);
    assert.match(css, /--it230-color-success: #00753a;/);
    assert.match(css, /--it230-color-warning: #905400;/);
    assert.match(css, /--it230-color-danger: #c30000;/);

    for (const name of IT230_ACCENT_NAMES) resolveIt230Accent(name);

    assert.deepEqual(await loadIt230LightTheme(), syntaxBefore);
});
