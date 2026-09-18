<script setup lang="ts">
defineProps<{
    component: string;
    message: string;
}>();
</script>

<template>
    <div class="it230-authoring-error" role="alert">
        <p class="it230-authoring-error__title">
            {{ component }} cannot render this slide
        </p>
        <p class="it230-authoring-error__message">{{ message }}</p>
    </div>
</template>

<style scoped>
/*
 * Shown in place of a component whose props do not validate, so the mistake is
 * legible on the slide rather than appearing as an empty region. It is never
 * part of a finished deck: `check-slides.mjs` fails on the console error that
 * accompanies it.
 */
.it230-authoring-error {
    background: var(--it230-color-surface);
    border: 2px solid var(--it230-color-danger);
    border-radius: var(--it230-radius-md);
    display: grid;
    gap: var(--it230-space-3);
    margin: 0 auto;
    max-width: 100%;
    padding: var(--it230-space-5);
    width: fit-content;
}

.it230-authoring-error__title {
    color: var(--it230-color-danger);
    font-weight: var(--it230-font-weight-black);
    margin: 0;
}

.it230-authoring-error__message {
    color: var(--it230-color-text);
    font-family: var(--it230-font-mono);
    margin: 0;
}
</style>
