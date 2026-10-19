<script setup lang="ts">
import { shallowRef } from "vue";

import { guardAuthoring } from "../setup/authoring-error.ts";
import {
    buildIconGrid,
    type IconGridItem,
    type IconSet,
} from "../setup/icon-grid.ts";
import AuthoringError from "./AuthoringError.vue";

const props = withDefaults(
    defineProps<{
        items: IconGridItem[];
        columns?: number;
        /** Reveal the items one per click, in order. */
        clicks?: boolean;
    }>(),
    { columns: undefined, clicks: false },
);

/*
 * The same dynamic import the Mermaid setup registers, so a deck that draws
 * Mermaid icon shapes and an IconGrid loads the 1.1 MB Carbon set once, as one
 * chunk, and a deck that uses neither never loads it. Until it arrives each
 * icon box renders empty at its final size, so nothing moves when it fills.
 */
const iconSet = shallowRef<IconSet | null>(null);
import("@iconify-json/carbon/icons.json")
    .then((module) => {
        iconSet.value = module.default as IconSet;
    })
    .catch((cause) => {
        console.error("[IconGrid] The Carbon icon set did not load.", cause);
    });

const { error, value: grid } = guardAuthoring("IconGrid", () =>
    buildIconGrid(props.items, props.columns, iconSet.value),
);
</script>

<template>
    <AuthoringError v-if="error" component="IconGrid" :message="error" />
    <div
        v-else-if="grid"
        class="it230-icon-grid"
        :style="{ '--it230-icon-grid-columns': grid.columns }"
    >
        <!--
            Vue cannot apply a directive conditionally, so the item appears
            twice: once with Slidev's v-click, which reveals it on the next
            click and keeps its space while hidden, and once without.
        -->
        <ul class="it230-icon-grid__list">
            <template v-for="(cell, index) in grid.cells" :key="index">
                <li v-if="clicks" v-click class="it230-icon-grid__item">
                    <svg
                        class="it230-icon-grid__icon"
                        :viewBox="cell.icon?.viewBox ?? '0 0 32 32'"
                        aria-hidden="true"
                        focusable="false"
                        v-html="cell.icon?.body ?? ''"
                    />
                    <span class="it230-icon-grid__caption">{{
                        cell.caption
                    }}</span>
                </li>
                <li v-else class="it230-icon-grid__item">
                    <svg
                        class="it230-icon-grid__icon"
                        :viewBox="cell.icon?.viewBox ?? '0 0 32 32'"
                        aria-hidden="true"
                        focusable="false"
                        v-html="cell.icon?.body ?? ''"
                    />
                    <span class="it230-icon-grid__caption">{{
                        cell.caption
                    }}</span>
                </li>
            </template>
        </ul>
    </div>
</template>

<style scoped>
/*
 * The list sits inside a wrapper so the layouts' `listSpacing: padded` rules,
 * which match a list placed directly on the slide or in a column, never reach
 * it. The theme's ordinary list markers, indent, and item margins are reset
 * here for the same reason: this is a set of facts laid out as a grid, not a
 * bulleted list.
 */
.it230-icon-grid {
    margin-block: 0 var(--it230-space-6);
    width: 100%;
}

.it230-icon-grid__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
    row-gap: var(--it230-space-6);
}

.it230-icon-grid__item {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex: 0 0 calc(100% / var(--it230-icon-grid-columns));
    flex-direction: column;
    gap: var(--it230-space-3);
    margin: 0;
    padding: 0 var(--it230-space-4);
    text-align: center;
}

/*
 * The accent fill, the bright shade the theme gives list markers, the title
 * rule, and borders. The icons are decorative, so they need no text contrast.
 */
.it230-icon-grid__icon {
    color: var(--it230-color-accent-fill);
    display: block;
    flex: none;
    height: 3rem;
    width: 3rem;
}

.it230-icon-grid__caption {
    color: var(--it230-color-text);
    font-size: 1.1rem;
    line-height: 1.35;
    max-width: 16em;
    overflow-wrap: break-word;
}
</style>
