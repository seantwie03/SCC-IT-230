import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import carbon from "@iconify-json/carbon/icons.json" with { type: "json" };

import {
    CARBON_BROWSER_URL,
    checkColumns,
    checkGridChildren,
    defaultColumns,
    resolveIcon,
    resolveItemIcon,
} from "../setup/icon-grid.ts";

const SET = {
    width: 32,
    height: 32,
    icons: {
        chip: { body: '<path d="M1 1"/>' },
        ruler: { body: '<path d="M2 2"/>' },
        wide: { body: '<path d="M3 3"/>', width: 48 },
    },
    aliases: {
        processor: { parent: "chip" },
        cpu: { parent: "processor" },
    },
};

const items = (count) => Array.from({ length: count }, () => ({ item: true }));

test("resolves an item's icon to its body and view box", () => {
    assert.deepEqual(resolveItemIcon("chip", SET), {
        body: '<path d="M1 1"/>',
        viewBox: "0 0 32 32",
    });
});

test("follows aliases, including an alias of an alias", () => {
    assert.equal(resolveIcon(SET, "cpu")?.body, '<path d="M1 1"/>');
});

test("uses an icon's own width when it has one", () => {
    assert.equal(resolveIcon(SET, "wide")?.viewBox, "0 0 48 32");
});

test("checks the icon name before the icon set has loaded", () => {
    assert.equal(resolveItemIcon("not-loaded-yet", null), null);
    assert.throws(
        () => resolveItemIcon("  ", null),
        /IconGridItem needs an icon/,
    );
});

test("points an unknown icon at the icon browser", () => {
    assert.throws(
        () => resolveItemIcon("harddrive", SET),
        (error) =>
            error.message.includes(
                'IconGridItem names "harddrive", which is not a Carbon icon',
            ) && error.message.includes(CARBON_BROWSER_URL),
    );
});

test("tells an author to drop a carbon: prefix", () => {
    assert.throws(
        () => resolveItemIcon("carbon:chip", SET),
        /Use the bare Carbon name, without a prefix/,
    );
});

test("keeps up to four items on one row, then avoids a lone straggler", () => {
    assert.deepEqual(
        [1, 2, 3, 4, 5, 6, 7, 8].map(defaultColumns),
        [1, 2, 3, 4, 3, 3, 4, 4],
    );
});

test("the grid's CSS applies the same column rule", async () => {
    const source = await readFile(
        new URL("../components/IconGrid.vue", import.meta.url),
        "utf8",
    );
    const base = source.match(
        /\.it230-icon-grid--auto \{\s*--it230-icon-grid-columns: (\d+);/,
    );
    assert.ok(base, "the automatic grid should set a one-item column count");
    const thresholds = [
        [1, Number(base[1])],
        ...[
            ...source.matchAll(
                /:nth-child\((\d+)\)\) \{\s*--it230-icon-grid-columns: (\d+);/g,
            ),
        ].map((match) => [Number(match[1]), Number(match[2])]),
    ];

    for (let count = 1; count <= 8; count += 1) {
        const applied = thresholds.filter(([from]) => from <= count).at(-1);
        assert.equal(
            applied[1],
            defaultColumns(count),
            `${count} items should make ${defaultColumns(count)} columns`,
        );
    }
});

test("rejects a column count outside 1 to 4", () => {
    assert.doesNotThrow(() => checkColumns(undefined));
    assert.doesNotThrow(() => checkColumns(4));
    for (const columns of [0, 5, 2.5]) {
        assert.throws(() => checkColumns(columns), /whole number from 1 to 4/);
    }
});

test("accepts one to eight items", () => {
    assert.doesNotThrow(() => checkGridChildren(items(1)));
    assert.doesNotThrow(() => checkGridChildren(items(8)));
});

test("rejects an empty or oversized grid", () => {
    assert.throws(() => checkGridChildren([]), /at least one IconGridItem/);
    assert.throws(
        () => checkGridChildren(items(9)),
        /at most 8 items, and this one has 9/,
    );
});

test("names a child that is not an IconGridItem", () => {
    assert.throws(
        () => checkGridChildren([{ item: true }, { item: false }]),
        /child 2 is not an IconGridItem/,
    );
});

test("every icon the gallery names exists in the installed Carbon set", async () => {
    const gallery = await readFile(
        new URL("../example.md", import.meta.url),
        "utf8",
    );
    const names = [
        ...gallery.matchAll(/<IconGridItem\b[^>]*\bicon="([^"]+)"/g),
    ].map((match) => match[1]);

    assert.ok(names.length > 0, "the gallery should show an IconGrid");
    for (const name of names) {
        assert.ok(resolveIcon(carbon, name), `"${name}" is not a Carbon icon`);
    }
});
