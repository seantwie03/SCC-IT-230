<script setup lang="ts">
import { useSlideContext } from "@slidev/client";
import { computed } from "vue";

import { isSequenceEndCueVisible } from "../setup/sequence-end-cue";

const { $clicksContext, $renderContext } = useSlideContext();
const visible = computed(() =>
    isSequenceEndCueVisible($clicksContext, $renderContext.value),
);
</script>

<template>
    <Transition name="it230-sequence-end-cue">
        <span
            v-if="visible"
            class="it230-sequence-end-cue"
            aria-label="Next click advances to the next slide"
        >
            NEXT
            <svg
                class="it230-sequence-end-cue__arrow"
                viewBox="0 0 16 16"
                aria-hidden="true"
            >
                <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
            </svg>
        </span>
    </Transition>
</template>

<style scoped>
/*
 * The arrow is drawn rather than typed. U+2192 falls outside both Lato subsets
 * the theme bundles, so as a character it was rendered by whichever generic
 * sans the reader's platform supplies, which is the one thing self-hosting the
 * fonts is meant to remove.
 */
.it230-sequence-end-cue__arrow {
    fill: none;
    height: 0.85em;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.75;
    width: 0.85em;
}

.it230-sequence-end-cue {
    align-items: center;
    color: var(--it230-color-accent-text);
    display: inline-flex;
    font-family: var(--it230-font-sans);
    font-size: 0.85rem;
    font-weight: var(--it230-font-weight-black);
    gap: var(--it230-space-1);
    letter-spacing: 0.04em;
    line-height: 1;
    pointer-events: none;
    white-space: nowrap;
}

.it230-sequence-end-cue-enter-active,
.it230-sequence-end-cue-leave-active {
    transition:
        opacity 150ms ease,
        transform 150ms ease;
}

.it230-sequence-end-cue-enter-from,
.it230-sequence-end-cue-leave-to {
    opacity: 0;
    transform: translateX(-0.25rem);
}
</style>
