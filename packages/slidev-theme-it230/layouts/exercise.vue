<script setup lang="ts">
type ExerciseVariant = "workflow" | "recording";

withDefaults(
    defineProps<{
        variant?: ExerciseVariant;
    }>(),
    {
        variant: "workflow",
    },
);
</script>

<template>
    <div class="slidev-layout it230-exercise" :data-variant="variant">
        <div class="it230-exercise__rail" aria-hidden="true"></div>

        <header class="it230-exercise__header">
            <div v-if="variant === 'workflow'" class="it230-exercise__eyebrow">
                Hands-on exercise
            </div>
            <slot />
        </header>

        <template v-if="variant === 'workflow'">
            <section class="it230-exercise__goal">
                <h2>Goal</h2>
                <div class="it230-exercise__goal-content">
                    <slot name="goal" />
                </div>
            </section>

            <section class="it230-exercise__environment">
                <h2>Environment</h2>
                <div class="it230-exercise__environment-content">
                    <slot name="environment" />
                </div>
            </section>

            <section class="it230-exercise__workflow">
                <h2>Workflow</h2>
                <div class="it230-exercise__workflow-content">
                    <slot name="workflow" />
                </div>
            </section>
        </template>

        <template v-else>
            <div class="it230-exercise__recording">
                <slot name="recording" />
            </div>

            <nav
                class="it230-exercise__resources"
                aria-label="Exercise resources"
            >
                <slot name="resources" />
            </nav>
        </template>
    </div>
</template>

<style scoped>
.it230-exercise {
    display: grid;
    gap: var(--it230-space-2) var(--it230-space-5);
    grid-template-columns: 0.4rem minmax(0, 1fr);
    grid-template-rows: auto auto auto minmax(0, 1fr);
    padding-top: var(--it230-space-4);
}

.it230-exercise__rail {
    background: linear-gradient(
        to bottom,
        var(--it230-color-accent-fill),
        color-mix(in srgb, var(--it230-color-accent-fill) 18%, transparent)
    );
    border-radius: 999px;
    box-shadow: 0 0.35rem 1rem var(--it230-color-accent-wash);
    grid-row: 1 / -1;
}

.it230-exercise__header,
.it230-exercise__goal,
.it230-exercise__environment,
.it230-exercise__workflow,
.it230-exercise__recording,
.it230-exercise__resources {
    grid-column: 2;
    min-width: 0;
}

.it230-exercise__eyebrow,
.it230-exercise h2 {
    color: var(--it230-color-accent-text);
    font-size: 0.78rem;
    font-weight: var(--it230-font-weight-black);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.it230-exercise__eyebrow {
    margin-bottom: var(--it230-space-1);
}

.it230-exercise__header :deep(h1) {
    font-size: 2.35rem;
    margin: 0;
}

.it230-exercise__header :deep(h1)::before {
    color: var(--it230-color-accent-text);
    content: "Exercise: ";
}

.it230-exercise__goal,
.it230-exercise__environment {
    display: block;
}

.it230-exercise__goal {
    padding: var(--it230-space-2) 0;
}

.it230-exercise h2 {
    margin: 0;
}

.it230-exercise__goal h2 {
    font-size: 0.9rem;
}

.it230-exercise__goal h2,
.it230-exercise__environment h2,
.it230-exercise__workflow h2 {
    margin-bottom: var(--it230-space-0);
}

.it230-exercise__goal-content :deep(p) {
    color: var(--it230-color-text);
    font-size: 1.3rem;
    font-weight: var(--it230-font-weight-bold);
    margin: 0;
}

.it230-exercise__goal-content {
    padding-inline-start: var(--it230-space-5);
}

.it230-exercise__environment {
    padding: var(--it230-space-2) 0 var(--it230-space-2);
}

.it230-exercise__environment-content :deep(p) {
    color: var(--it230-color-muted);
    font-size: 0.95rem;
    margin: 0;
}

.it230-exercise__environment-content {
    padding-inline-start: var(--it230-space-5);
}

.it230-exercise__workflow {
    min-height: 0;
    padding-top: var(--it230-space-0);
}

.it230-exercise__workflow-content {
    min-height: 0;
}

.it230-exercise__workflow-content :deep(ol) {
    display: flex;
    flex-direction: column;
    font-size: 1.05rem;
    height: 100%;
    justify-content: flex-start;
    line-height: 1.3;
    margin: 0;
    margin-inline-start: var(--it230-space-5);
    padding-inline-start: 1em;
}

.it230-exercise__workflow-content :deep(li) {
    margin: 0;
    padding-inline-start: var(--it230-space-2);
}

.it230-exercise__workflow-content :deep(li::marker) {
    color: var(--it230-color-accent-text);
    font-size: 1.08em;
    font-weight: var(--it230-font-weight-black);
}

.it230-exercise[data-variant="recording"] {
    grid-template-rows: auto minmax(0, 1fr) auto;
}

.it230-exercise[data-variant="recording"] .it230-exercise__header :deep(h1) {
    text-align: center;
}

.it230-exercise__recording {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
}

.it230-exercise__recording :deep(p) {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    margin: 0;
    min-height: 0;
    width: 100%;
}

.it230-exercise__recording :deep(img) {
    display: block;
    height: 100%;
    margin: 0;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: auto;
}

.it230-exercise__resources {
    display: flex;
    font-size: 1rem;
    justify-content: center;
}

.it230-exercise__resources :deep(p) {
    background: var(--it230-color-surface);
    border: 0.08rem solid
        color-mix(
            in srgb,
            var(--it230-color-accent-fill) 45%,
            var(--it230-color-line)
        );
    border-radius: var(--it230-radius-md);
    display: inline-flex;
    margin: 0;
    overflow: hidden;
}

.it230-exercise__resources :deep(a) {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    min-width: 13rem;
    padding: var(--it230-space-2) var(--it230-space-5);
    white-space: nowrap;
}

.it230-exercise__resources :deep(a + a) {
    border-inline-start: 0.08rem solid
        color-mix(
            in srgb,
            var(--it230-color-accent-fill) 45%,
            var(--it230-color-line)
        );
}
</style>
