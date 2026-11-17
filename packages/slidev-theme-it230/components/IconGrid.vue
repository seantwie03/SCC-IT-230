<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from "vue";

import { guardAuthoring } from "../setup/authoring-error.ts";
import { checkColumns, checkGridChildren } from "../setup/icon-grid.ts";
import AuthoringError from "./AuthoringError.vue";

/*
 * A grid of IconGridItem children, each an icon above a caption. The items are
 * slot content, so Slidev compiles each caption as Markdown, and its own
 * directives, such as v-click, work on each item as written.
 */
const props = withDefaults(defineProps<{ columns?: number }>(), {
    columns: undefined,
});

const { error: columnsError } = guardAuthoring("IconGrid", () =>
    checkColumns(props.columns),
);

/*
 * Slot content is not data the script can count, so the rendered list is
 * checked instead, after every render: one to eight children, each an
 * IconGridItem. The message is also written to the console, as
 * guardAuthoring does, because check-slides.mjs fails a deck on console
 * errors. The list stays rendered under the message, so the check runs again
 * on the next hot update and clears once the slide is fixed.
 */
const list = ref<HTMLUListElement | null>(null);
const childrenError = ref<string | null>(null);

function checkRenderedChildren(): void {
    const element = list.value;
    if (!element) return;
    try {
        checkGridChildren(
            Array.from(element.children, (child) => ({
                item: child.classList.contains("it230-icon-grid__item"),
            })),
        );
        childrenError.value = null;
    } catch (cause) {
        childrenError.value =
            cause instanceof Error ? cause.message : String(cause);
    }
}

onMounted(checkRenderedChildren);
onUpdated(checkRenderedChildren);
watch(childrenError, (message) => {
    if (message) console.error(`[IconGrid] ${message}`);
});
</script>

<template>
    <AuthoringError
        v-if="columnsError"
        component="IconGrid"
        :message="columnsError"
    />
    <div
        v-else
        class="it230-icon-grid"
        :class="{ 'it230-icon-grid--auto': columns === undefined }"
        :style="
            columns === undefined
                ? undefined
                : { '--it230-icon-grid-columns': columns }
        "
    >
        <AuthoringError
            v-if="childrenError"
            component="IconGrid"
            :message="childrenError"
        />
        <ul ref="list" class="it230-icon-grid__list">
            <slot />
        </ul>
    </div>
</template>

<style scoped>
/*
 * The list sits inside a wrapper so the layouts' `listSpacing: padded` rules,
 * which match a list placed directly on the slide or in a column, never reach
 * it. The theme's ordinary list markers and indent are reset here for the
 * same reason: this is a set of facts laid out as a grid, not a bulleted list.
 * IconGridItem resets each item's own margins.
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
</style>

<style>
/*
 * The automatic column count, from how many items the list holds, following
 * defaultColumns in setup/icon-grid.ts: up to four items share a row, five or
 * six make rows of three, seven or eight rows of four. A test checks these
 * rules against that function. Unscoped, because Vue's scoping does not reach
 * into :has(); the class names are the component's own. An explicit `columns`
 * drops the --auto class and sets the property inline instead.
 */
.it230-icon-grid--auto {
    --it230-icon-grid-columns: 1;
}

.it230-icon-grid--auto:has(> .it230-icon-grid__list > :nth-child(2)) {
    --it230-icon-grid-columns: 2;
}

.it230-icon-grid--auto:has(> .it230-icon-grid__list > :nth-child(3)) {
    --it230-icon-grid-columns: 3;
}

.it230-icon-grid--auto:has(> .it230-icon-grid__list > :nth-child(4)) {
    --it230-icon-grid-columns: 4;
}

.it230-icon-grid--auto:has(> .it230-icon-grid__list > :nth-child(5)) {
    --it230-icon-grid-columns: 3;
}

.it230-icon-grid--auto:has(> .it230-icon-grid__list > :nth-child(7)) {
    --it230-icon-grid-columns: 4;
}
</style>
