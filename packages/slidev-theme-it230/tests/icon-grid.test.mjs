import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import carbon from "@iconify-json/carbon/icons.json" with { type: "json" };

import {
    buildIconGrid,
    CARBON_BROWSER_URL,
    defaultColumns,
    resolveIcon,
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

const TWO = [
    { icon: "chip", caption: "Used with BIOS firmware" },
    { icon: "ruler", caption: "Disks up to 2 TiB" },
];

test("resolves each icon to its body and view box", () => {
    const grid = buildIconGrid(TWO, undefined, SET);

    assert.equal(grid.columns, 2);
    assert.deepEqual(grid.cells[0], {
        caption: "Used with BIOS firmware",
        icon: { body: '<path d="M1 1"/>', viewBox: "0 0 32 32" },
    });
});

test("follows aliases, including an alias of an alias", () => {
    assert.equal(resolveIcon(SET, "cpu")?.body, '<path d="M1 1"/>');
});

test("uses an icon's own width when it has one", () => {
    assert.equal(resolveIcon(SET, "wide")?.viewBox, "0 0 48 32");
});

test("keeps up to four items on one row, then avoids a lone straggler", () => {
    assert.deepEqual(
        [1, 2, 3, 4, 5, 6, 7, 8].map(defaultColumns),
        [1, 2, 3, 4, 3, 3, 4, 4],
    );
});

test("an explicit column count wins over the default", () => {
    assert.equal(buildIconGrid(TWO, 1, SET).columns, 1);
});

test("checks structure before the icon set has loaded", () => {
    const grid = buildIconGrid(
        [{ icon: "not-loaded-yet", caption: "Waiting" }],
        undefined,
        null,
    );

    assert.deepEqual(grid.cells, [{ caption: "Waiting", icon: null }]);
    assert.throws(
        () => buildIconGrid([], undefined, null),
        /at least one item/,
    );
});

test("rejects an empty or oversized grid", () => {
    assert.throws(() => buildIconGrid([], undefined, SET), /at least one item/);

    const nine = Array.from({ length: 9 }, () => TWO[0]);
    assert.throws(
        () => buildIconGrid(nine, undefined, SET),
        /at most 8 items, and this one has 9/,
    );
});

test("names the item that is missing an icon or a caption", () => {
    assert.throws(
        () => buildIconGrid([TWO[0], { caption: "No icon" }], undefined, SET),
        /item 2 needs an icon/,
    );
    assert.throws(
        () => buildIconGrid([{ icon: "chip", caption: "  " }], undefined, SET),
        /item 1 needs a caption/,
    );
});

test("rejects a column count outside 1 to 4", () => {
    for (const columns of [0, 5, 2.5]) {
        assert.throws(
            () => buildIconGrid(TWO, columns, SET),
            /whole number from 1 to 4/,
        );
    }
});

test("points an unknown icon at the icon browser", () => {
    assert.throws(
        () =>
            buildIconGrid(
                [{ icon: "harddrive", caption: "x" }],
                undefined,
                SET,
            ),
        (error) =>
            error.message.includes('"harddrive", which is not a Carbon icon') &&
            error.message.includes(CARBON_BROWSER_URL),
    );
});

test("tells an author to drop a carbon: prefix", () => {
    assert.throws(
        () =>
            buildIconGrid(
                [{ icon: "carbon:chip", caption: "x" }],
                undefined,
                SET,
            ),
        /Use the bare Carbon name, without a prefix/,
    );
});

test("every icon the gallery names exists in the installed Carbon set", async () => {
    const gallery = await readFile(
        new URL("../example.md", import.meta.url),
        "utf8",
    );
    const names = [...gallery.matchAll(/\{\s*icon:\s*'([^']+)'/g)].map(
        (match) => match[1],
    );

    assert.ok(names.length > 0, "the gallery should show an IconGrid");
    for (const name of names) {
        assert.ok(resolveIcon(carbon, name), `"${name}" is not a Carbon icon`);
    }
});
