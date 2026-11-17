<script setup lang="ts">
import { shallowRef } from "vue";

import { guardAuthoring } from "../setup/authoring-error.ts";
import { resolveItemIcon, type IconSet } from "../setup/icon-grid.ts";
import AuthoringError from "./AuthoringError.vue";

/*
 * One item of an `IconGrid`: an icon above a caption. The caption is the
 * default slot, so Slidev compiles it as Markdown, and the root is a single
 * list item, so a `v-click` written on the component lands on it.
 */
const props = defineProps<{ icon: string }>();

/*
 * The same dynamic import the Mermaid setup registers, so a deck that draws
 * Mermaid icon shapes and an IconGrid loads the 1.1 MB Carbon set once, as one
 * chunk, however many items ask for it, and a deck that uses neither never
 * loads it. Until it arrives each icon box renders empty at its final size, so
 * nothing moves when it fills.
 */
const iconSet = shallowRef<IconSet | null>(null);
import("@iconify-json/carbon/icons.json")
    .then((module) => {
        iconSet.value = module.default as IconSet;
    })
    .catch((cause) => {
        console.error(
            "[IconGridItem] The Carbon icon set did not load.",
            cause,
        );
    });

const { error, value: resolved } = guardAuthoring("IconGridItem", () =>
    resolveItemIcon(props.icon, iconSet.value),
);
</script>

<template>
    <li class="it230-icon-grid__item">
        <AuthoringError
            v-if="error"
            component="IconGridItem"
            :message="error"
        />
        <template v-else>
            <svg
                class="it230-icon-grid__icon"
                :viewBox="resolved?.viewBox ?? '0 0 32 32'"
                aria-hidden="true"
                focusable="false"
                v-html="resolved?.body ?? ''"
            />
            <div class="it230-icon-grid__caption"><slot /></div>
        </template>
    </li>
</template>

<style scoped>
/*
 * Each item takes its share of the row from the column count IconGrid sets,
 * and resets the theme's list-item margins and indent.
 */
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

/*
 * Markdown wraps the slot's text in a paragraph, which the theme gives a
 * bottom margin. The caption is one short phrase, so the margin goes.
 */
.it230-icon-grid__caption :deep(p) {
    margin: 0;
}
</style>
