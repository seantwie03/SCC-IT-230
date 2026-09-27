<script setup lang="ts">
import {
    computed,
    defineComponent,
    h,
    resolveComponent,
    type PropType,
} from "vue";

import { guardAuthoring } from "../setup/authoring-error.ts";
import {
    buildStates,
    selectSize,
    type TextExplainerSize,
    type TextExplainerState,
    type TextExplainerStep,
} from "../setup/text-explainer.ts";
import AuthoringError from "./AuthoringError.vue";

const ClickSequence = defineComponent({
    props: {
        states: {
            type: Array as PropType<TextExplainerState[]>,
            required: true,
        },
    },
    setup(sequenceProps, { slots }) {
        const vSwitch = resolveComponent("VSwitch");

        return () =>
            h(
                vSwitch,
                {},
                Object.fromEntries(
                    sequenceProps.states.map((state, index) => [
                        String(index),
                        () => slots.default?.({ state }),
                    ]),
                ),
            );
    },
});

const props = defineProps<{
    lines: string[];
    steps: TextExplainerStep[];
    size?: TextExplainerSize;
}>();

const { error, value: states } = guardAuthoring("TextExplainer", () =>
    buildStates(props.lines, props.steps),
);

const size = computed(() => props.size ?? selectSize(props.lines));
</script>

<template>
    <AuthoringError v-if="error" component="TextExplainer" :message="error" />
    <ClickSequence v-else v-slot="{ state }" :states="states ?? []">
        <figure
            class="it230-text-explainer"
            :class="`it230-text-explainer--${size}`"
        >
            <code class="it230-text-explainer__text"
                ><span
                    v-for="(line, lineIndex) in state.lines"
                    :key="lineIndex"
                    class="it230-text-explainer__line"
                    ><template
                        v-for="(segment, segmentIndex) in line.segments"
                        :key="segmentIndex"
                        ><mark
                            v-if="segment.active"
                            class="it230-text-explainer__active"
                            >{{ segment.text }}</mark
                        ><span
                            v-else
                            :class="{
                                'it230-text-explainer__candidate':
                                    segment.highlightable,
                            }"
                            >{{ segment.text }}</span
                        ></template
                    ></span
                ></code
            >
            <!-- Hidden captions reserve the height of the tallest click state. -->
            <span
                v-for="(captionState, captionIndex) in states"
                :key="captionIndex"
                aria-hidden="true"
                class="it230-text-explainer__explanation it230-text-explainer__caption-sizer"
                >{{ captionState.explanation }}</span
            >
            <figcaption class="it230-text-explainer__explanation">
                {{ state.explanation }}
            </figcaption>
        </figure>
    </ClickSequence>
</template>

<style scoped>
.it230-text-explainer {
    align-items: center;
    display: grid;
    gap: var(--it230-space-6);
    grid-template-rows: 1fr auto;
    margin: 0 auto;
    max-width: 100%;
    padding: var(--it230-space-5);
    /*
     * Size to the content rather than a fixed width. The slide canvas is 980
     * CSS pixels wide, so a rem width picked for a 1920px canvas overflows the
     * layout even when the text itself fits.
     */
    width: fit-content;
}

/*
 * A block `code` element rather than `pre`. The
 * theme gives `.slidev-layout pre` a surface background with `!important`,
 * which is right for a fenced code block and wrong for this flat presentation.
 */
.it230-text-explainer__text {
    background: transparent;
    border: 0;
    border-radius: 0;
    color: var(--it230-color-text);
    display: block;
    font-family: var(--it230-font-mono);
    font-weight: var(--it230-font-weight-code);
    justify-self: center;
    line-height: 1.5;
    margin: 0;
    max-width: 100%;
    padding: 0;
    /* The center layout centers text; each line must still start at column 1. */
    text-align: left;
    white-space: pre;
}

.it230-text-explainer--lg .it230-text-explainer__text {
    font-size: 2rem;
}

.it230-text-explainer--md .it230-text-explainer__text {
    font-size: 1.4rem;
}

.it230-text-explainer--sm .it230-text-explainer__text {
    font-size: 1rem;
}

.it230-text-explainer__line {
    display: block;
    min-height: 1lh;
}

.it230-text-explainer__candidate,
.it230-text-explainer__active {
    border: 1px solid transparent;
    border-radius: var(--it230-radius-sm);
    padding: 0.05em 0.1em;
}

.it230-text-explainer__active {
    background: var(--it230-color-surface);
    border-color: var(--it230-color-accent-fill);
    color: var(--it230-color-accent-text);
    font-weight: var(--it230-font-weight-black);
}

.it230-text-explainer__explanation {
    /*
     * Reserved space is the tallest caption, so a shorter one is centered in it
     * and its own edges move between click states. Anchor the top instead: a
     * caption grows downward and its first line stays where the eye left it.
     */
    align-self: start;
    background: var(--it230-color-surface);
    border: 1px solid var(--it230-color-accent-fill);
    border-radius: var(--it230-radius-sm);
    color: var(--it230-color-accent-text);
    font-size: 1.75rem;
    font-weight: var(--it230-font-weight-black);
    grid-column: 1;
    grid-row: 2;
    justify-self: center;
    line-height: 1.35;
    padding: var(--it230-space-2) var(--it230-space-3);
    text-align: center;
    white-space: pre-line;
}

.it230-text-explainer__caption-sizer {
    visibility: hidden;
}

.it230-text-explainer--sm .it230-text-explainer__explanation {
    font-size: 1.5rem;
}
</style>
