<script setup lang="ts">
import { useSlideContext } from "@slidev/client";
import { onMounted, onUnmounted, ref, watchEffect } from "vue";

import {
    accentCssVariables,
    resolveIt230Accent,
    type It230Accent,
} from "./setup/accent";

const { $slidev } = useSlideContext();
const configurationError = ref<string>();
let stopWatching: (() => void) | undefined;

onMounted(() => {
    stopWatching = watchEffect(() => {
        try {
            const accent = resolveIt230Accent($slidev.themeConfigs.it230Accent);
            configurationError.value = undefined;
            applyAccent(accent, accent.name);
        } catch (error) {
            configurationError.value =
                error instanceof Error
                    ? error.message
                    : "The IT-230 deck accent is invalid.";
            console.error(configurationError.value);
            applyAccent(resolveIt230Accent(), "invalid");
        }
    });
});

onUnmounted(() => stopWatching?.());

function applyAccent(accent: It230Accent, state: string) {
    const root = document.documentElement;

    root.dataset.it230Accent = state;
    for (const [property, value] of Object.entries(
        accentCssVariables(accent),
    )) {
        root.style.setProperty(property, value);
    }
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="configurationError"
            class="it230-configuration-error"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <section
                class="it230-configuration-error__panel"
                aria-labelledby="it230-configuration-error-title"
            >
                <p class="it230-configuration-error__label">
                    IT-230 theme configuration error
                </p>
                <h1 id="it230-configuration-error-title">
                    Invalid deck accent
                </h1>
                <p>{{ configurationError }}</p>
                <p>Correct the value in the deck headmatter. For example:</p>
                <pre><code>themeConfig:
  it230Accent: teal</code></pre>
            </section>
        </div>
    </Teleport>
</template>

<style scoped>
.it230-configuration-error {
    align-items: center;
    background: rgb(250 250 251 / 97%);
    color: #25252b;
    display: flex;
    font-family: var(--it230-font-sans);
    inset: 0;
    justify-content: center;
    padding: 2rem;
    position: fixed;
    z-index: 10000;
}

.it230-configuration-error__panel {
    background: #ffffff;
    border: 0.2rem solid var(--it230-color-danger);
    border-radius: var(--it230-radius-lg);
    box-shadow: var(--it230-shadow-raised);
    max-width: 48rem;
    padding: 2rem 2.5rem;
    width: 100%;
}

.it230-configuration-error__label {
    color: var(--it230-color-danger);
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    margin: 0 0 0.75rem;
    text-transform: uppercase;
}

.it230-configuration-error h1 {
    font-size: 2.5rem;
    line-height: 1.1;
    margin: 0 0 1.25rem;
}

.it230-configuration-error p {
    font-size: 1.2rem;
    line-height: 1.5;
    margin: 0.75rem 0;
}

.it230-configuration-error pre {
    background: var(--it230-color-raised);
    border: 1px solid var(--it230-color-line);
    border-radius: var(--it230-radius-sm);
    font-family: var(--it230-font-mono);
    font-size: 1.1rem;
    line-height: 1.5;
    margin: 1rem 0 0;
    overflow-wrap: anywhere;
    padding: 1rem 1.25rem;
    white-space: pre-wrap;
}
</style>
