<script setup lang="ts">
import { resolveHueTextColor } from "../setup/accent.ts";
import { guardAuthoring } from "../setup/authoring-error.ts";
import AuthoringError from "./AuthoringError.vue";

const props = withDefaults(
    defineProps<{
        code?: boolean;
        /** A palette hue to draw in instead of the deck accent. */
        hue?: string;
        italic?: boolean;
        normal?: boolean;
    }>(),
    {
        code: false,
        hue: undefined,
        italic: false,
        normal: false,
    },
);

const { error, value: hueColor } = guardAuthoring("AccentText", () =>
    props.hue === undefined ? null : resolveHueTextColor(props.hue),
);
</script>

<template>
    <AuthoringError v-if="error" component="AccentText" :message="error" />
    <span
        v-else
        :class="[
            'it230-color-text',
            {
                'it230-color-text--italic': italic,
                'it230-color-text--code': code,
                'it230-color-text--normal': normal,
            },
        ]"
        :style="hueColor ? { color: hueColor } : undefined"
        ><slot
    /></span>
</template>

<style scoped>
.it230-color-text {
    color: var(--it230-color-accent-text);
    font-weight: var(--it230-font-weight-bold);
}

.it230-color-text.it230-color-text--normal {
    font-weight: var(--it230-font-weight-regular);
}

.it230-color-text--italic {
    font-style: italic;
}

.it230-color-text--code {
    font-family: var(--it230-font-mono);
}
</style>
