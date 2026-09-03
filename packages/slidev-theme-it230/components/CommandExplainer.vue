<script setup lang="ts">
import {
    computed,
    defineComponent,
    h,
    resolveComponent,
    type PropType,
} from "vue";

interface CommandSegment {
    text: string;
    active?: boolean;
    highlightable?: boolean;
}

interface CommandStep {
    active: string;
    command?: string;
    explanation: string;
    occurrence?: number;
}

interface CommandState {
    explanation: string;
    segments: CommandSegment[];
}

interface ResolvedStep {
    activeEnd: number;
    activeStart: number;
    command: string;
    explanation: string;
}

const ClickSequence = defineComponent({
    props: {
        states: {
            type: Array as PropType<CommandState[]>,
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
    command?: string;
    explanation?: string;
    segments?: CommandSegment[];
    steps?: CommandStep[];
}>();

const states = computed<CommandState[]>(() => {
    if (props.steps?.length) {
        if (props.segments || props.explanation)
            throw new Error(
                "CommandExplainer cannot combine steps with segments or explanation.",
            );

        return buildStepStates(props.steps, props.command);
    }

    if (!props.segments?.length || !props.explanation)
        throw new Error(
            "CommandExplainer requires steps, or both segments and explanation.",
        );

    if (props.segments.filter((segment) => segment.active).length !== 1)
        throw new Error(
            "CommandExplainer segments must contain exactly one active segment.",
        );

    return [
        {
            explanation: props.explanation,
            segments: props.segments,
        },
    ];
});

function requiredExplanation(explanation: string, index: number): string {
    if (explanation.length > 0) return explanation;
    throw new Error(`CommandExplainer step ${index + 1} needs an explanation.`);
}

function buildStepStates(
    steps: CommandStep[],
    baseCommand: string | undefined,
): CommandState[] {
    const resolvedSteps = steps.map((step, index) =>
        resolveStep(step.command ?? baseCommand, step, index),
    );
    const rangesByCommand = new Map<
        string,
        Array<{ start: number; end: number }>
    >();

    for (const step of resolvedSteps) {
        const ranges = rangesByCommand.get(step.command) ?? [];
        if (
            !ranges.some(
                (range) =>
                    range.start === step.activeStart &&
                    range.end === step.activeEnd,
            )
        ) {
            ranges.push({ start: step.activeStart, end: step.activeEnd });
            ranges.sort((a, b) => a.start - b.start);
            const overlap = ranges.some(
                (range, index) =>
                    index > 0 && range.start < ranges[index - 1].end,
            );
            if (overlap)
                throw new Error(
                    `CommandExplainer active segments for ${JSON.stringify(step.command)} cannot overlap.`,
                );
        }
        rangesByCommand.set(step.command, ranges);
    }

    return resolvedSteps.map((step) => ({
        explanation: step.explanation,
        segments: splitAtHighlightableRanges(
            step,
            rangesByCommand.get(step.command) ?? [],
        ),
    }));
}

function resolveStep(
    command: string | undefined,
    step: CommandStep,
    index: number,
): ResolvedStep {
    if (!command)
        throw new Error(`CommandExplainer step ${index + 1} needs a command.`);
    if (!step.active)
        throw new Error(
            `CommandExplainer step ${index + 1} needs active text.`,
        );

    const matches: number[] = [];
    let searchFrom = 0;
    while (searchFrom <= command.length - step.active.length) {
        const match = command.indexOf(step.active, searchFrom);
        if (match === -1) break;
        matches.push(match);
        searchFrom = match + step.active.length;
    }

    if (matches.length === 0)
        throw new Error(
            `CommandExplainer step ${index + 1} cannot find ${JSON.stringify(step.active)} in ${JSON.stringify(command)}.`,
        );

    let matchIndex: number;
    if (step.occurrence === undefined) {
        if (matches.length !== 1)
            throw new Error(
                `CommandExplainer step ${index + 1} finds ${JSON.stringify(step.active)} ${matches.length} times; set occurrence to select one.`,
            );
        matchIndex = matches[0];
    } else {
        if (
            !Number.isInteger(step.occurrence) ||
            step.occurrence < 1 ||
            step.occurrence > matches.length
        )
            throw new Error(
                `CommandExplainer step ${index + 1} occurrence must be between 1 and ${matches.length}.`,
            );
        matchIndex = matches[step.occurrence - 1];
    }

    return {
        activeEnd: matchIndex + step.active.length,
        activeStart: matchIndex,
        command,
        explanation: requiredExplanation(step.explanation, index),
    };
}

function splitAtHighlightableRanges(
    step: ResolvedStep,
    ranges: Array<{ start: number; end: number }>,
): CommandSegment[] {
    const segments: CommandSegment[] = [];
    let cursor = 0;

    for (const range of ranges) {
        if (cursor < range.start)
            segments.push({ text: step.command.slice(cursor, range.start) });
        segments.push({
            active:
                range.start === step.activeStart &&
                range.end === step.activeEnd,
            highlightable: true,
            text: step.command.slice(range.start, range.end),
        });
        cursor = range.end;
    }

    if (cursor < step.command.length)
        segments.push({ text: step.command.slice(cursor) });

    return segments;
}
</script>

<template>
    <ClickSequence v-slot="{ state }" :states="states">
        <figure class="it230-command-explainer">
            <code class="it230-command-explainer__command"
                ><template
                    v-for="(segment, segmentIndex) in state.segments"
                    :key="segmentIndex"
                    ><mark
                        v-if="segment.active"
                        class="it230-command-explainer__active"
                        >{{ segment.text }}</mark
                    ><span
                        v-else
                        :class="{
                            'it230-command-explainer__candidate':
                                segment.highlightable,
                        }"
                        >{{ segment.text }}</span
                    ></template
                ></code
            >
            <figcaption class="it230-command-explainer__explanation">
                {{ state.explanation }}
            </figcaption>
        </figure>
    </ClickSequence>
</template>

<style scoped>
.it230-command-explainer {
    align-items: center;
    display: grid;
    gap: var(--it230-space-7);
    grid-template-rows: 1fr auto;
    margin: 0 auto;
    min-height: 18rem;
    padding: var(--it230-space-7);
    max-width: 100%;
    width: 46rem;
}

.it230-command-explainer__command {
    background: transparent;
    border-radius: 0;
    color: var(--it230-color-text);
    display: block;
    font-family: var(--it230-font-mono);
    font-size: 2rem;
    font-weight: var(--it230-font-weight-code);
    justify-self: center;
    line-height: 1.5;
    padding: 0;
    white-space: pre;
}

.it230-command-explainer__candidate,
.it230-command-explainer__active {
    border: 1px solid transparent;
    border-radius: var(--it230-radius-sm);
    padding: 0.05em 0.1em;
}

.it230-command-explainer__active {
    background: var(--it230-color-surface);
    border-color: var(--it230-color-accent-fill);
    color: var(--it230-color-accent-text);
    font-weight: var(--it230-font-weight-black);
}

.it230-command-explainer__explanation {
    background: var(--it230-color-surface);
    border: 1px solid var(--it230-color-accent-fill);
    border-radius: var(--it230-radius-sm);
    color: var(--it230-color-accent-text);
    font-size: 1.75rem;
    font-weight: var(--it230-font-weight-black);
    justify-self: center;
    line-height: 1.35;
    padding: var(--it230-space-2) var(--it230-space-3);
    text-align: center;
    white-space: pre-line;
}
</style>
