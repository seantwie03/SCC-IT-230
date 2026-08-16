<script setup lang="ts">
import { computed } from "vue";

type CalloutTone = "accent" | "success" | "warning" | "danger";

const props = withDefaults(
    defineProps<{
        title?: string;
        type?: CalloutTone;
    }>(),
    {
        title: undefined,
        type: "accent",
    },
);

const defaults: Record<CalloutTone, { title: string }> = {
    accent: { title: "Note" },
    success: { title: "Tip" },
    warning: { title: "Warning" },
    danger: { title: "Caution" },
};

const label = computed(() => props.title ?? defaults[props.type].title);
</script>

<template>
    <aside class="it230-callout" :data-tone="type" :aria-label="label">
        <div class="it230-callout__heading">
            <span class="it230-callout__mark" aria-hidden="true">
                <svg
                    v-if="type === 'accent'"
                    class="it230-callout__icon"
                    viewBox="0 0 16 16"
                >
                    <circle
                        cx="8"
                        cy="2.75"
                        r="1.2"
                        fill="currentColor"
                        stroke="none"
                    />
                    <path d="M8 6.75v5.5" />
                </svg>
                <svg
                    v-else-if="type === 'success'"
                    class="it230-callout__icon"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 3v10M3 8h10" />
                </svg>
                <svg
                    v-else-if="type === 'warning'"
                    class="it230-callout__icon"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 3v5.5" />
                    <circle
                        cx="8"
                        cy="12.25"
                        r="1.125"
                        fill="currentColor"
                        stroke="none"
                    />
                </svg>
                <svg v-else class="it230-callout__icon" viewBox="0 0 16 16">
                    <path d="m4 4 8 8m0-8-8 8" />
                </svg>
            </span>
            <span>{{ label }}</span>
        </div>
        <div class="it230-callout__body">
            <slot />
        </div>
    </aside>
</template>

<style scoped>
.it230-callout {
    --it230-callout-boundary: var(--it230-color-accent-fill);
    --it230-callout-text: var(--it230-color-accent-text);

    background: var(--it230-color-surface);
    border: 1px solid var(--it230-callout-boundary);
    border-left: 0.35rem solid var(--it230-callout-boundary);
    border-radius: var(--it230-radius-md);
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 6 / 7%);
    margin-bottom: var(--it230-space-4);
    padding: var(--it230-space-4) var(--it230-space-5);
}

.it230-callout[data-tone="success"] {
    --it230-callout-boundary: var(--it230-color-success);
    --it230-callout-text: var(--it230-color-success);
}

.it230-callout[data-tone="warning"] {
    --it230-callout-boundary: var(--it230-color-warning);
    --it230-callout-text: var(--it230-color-warning);
}

.it230-callout[data-tone="danger"] {
    --it230-callout-boundary: var(--it230-color-danger);
    --it230-callout-text: var(--it230-color-danger);
}

.it230-callout__heading {
    align-items: center;
    color: var(--it230-callout-text);
    display: flex;
    font-size: 0.9rem;
    font-weight: 800;
    gap: var(--it230-space-3);
    letter-spacing: 0;
    margin-bottom: var(--it230-space-2);
}

.it230-callout__mark {
    border: 0.12rem solid currentColor;
    border-radius: 999px;
    display: inline-grid;
    flex: 0 0 auto;
    height: 1.35rem;
    place-items: center;
    width: 1.35rem;
}

.it230-callout__icon {
    display: block;
    fill: none;
    height: 0.78rem;
    overflow: visible;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    width: 0.78rem;
}

.it230-callout__body {
    color: var(--it230-color-text);
    font-size: 1rem;
    line-height: 1.5;
}

.it230-callout__body :deep(:last-child) {
    margin-bottom: 0;
}
</style>
