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
            NEXT <span aria-hidden="true">→</span>
        </span>
    </Transition>
</template>

<style scoped>
.it230-sequence-end-cue {
    color: var(--it230-color-accent-text);
    display: inline-flex;
    font-family: var(--it230-font-sans);
    font-size: 0.85rem;
    font-weight: 800;
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
