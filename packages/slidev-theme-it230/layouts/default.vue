<script setup lang="ts">
type VerticalAlignment = "start" | "center" | "evenly";
type HorizontalAlignment = "start" | "center" | "end";
type ListSpacing = "normal" | "padded";

withDefaults(
    defineProps<{
        horizontal?: HorizontalAlignment;
        listSpacing?: ListSpacing;
        vertical?: VerticalAlignment;
    }>(),
    {
        horizontal: "start",
        listSpacing: "normal",
        vertical: "evenly",
    },
);
</script>

<template>
    <div
        class="slidev-layout it230-default"
        :data-horizontal="horizontal"
        :data-list-spacing="listSpacing"
        :data-vertical="vertical"
    >
        <slot />
    </div>
</template>

<style scoped>
.it230-default {
    display: flex;
    flex-direction: column;
}

.it230-default[data-vertical="center"] :deep(> h1:first-child),
.it230-default[data-vertical="evenly"] :deep(> h1:first-child) {
    margin-bottom: 0;
}

.it230-default[data-vertical="center"] :deep(> h1:first-child + *) {
    margin-top: auto;
}

.it230-default[data-vertical="center"] :deep(> h1:first-child ~ :last-child) {
    margin-bottom: auto;
}

.it230-default[data-vertical="evenly"] :deep(> h1:first-child + *) {
    margin-top: auto;
}

.it230-default[data-vertical="evenly"] :deep(> h1:first-child ~ *) {
    margin-bottom: auto;
}

.it230-default[data-vertical="center"]
    :deep(> h1:first-child + .slidev-code-wrapper),
.it230-default[data-vertical="evenly"]
    :deep(> h1:first-child + .slidev-code-wrapper) {
    margin-top: auto !important;
}

.it230-default[data-vertical="center"]
    :deep(> h1:first-child ~ .slidev-code-wrapper:last-child),
.it230-default[data-vertical="evenly"]
    :deep(> h1:first-child ~ .slidev-code-wrapper) {
    margin-bottom: auto !important;
}

.it230-default[data-horizontal="center"]
    :deep(> :is(h1, h2, h3):first-child ~ *) {
    align-self: center;
    max-width: 100%;
}

.it230-default[data-horizontal="end"] :deep(> :is(h1, h2, h3):first-child ~ *) {
    align-self: flex-end;
    max-width: 100%;
}

.it230-default :deep(> p:has(> img:only-child)) {
    align-items: center;
    display: flex;
    flex: 1 1 0;
    justify-content: center;
    margin: 0;
    min-height: 0;
    overflow: hidden;
    width: 100%;
}

.it230-default[data-vertical="center"]
    :deep(> h1:first-child + p:has(> img:only-child)),
.it230-default[data-vertical="evenly"]
    :deep(> h1:first-child + p:has(> img:only-child)) {
    padding-top: var(--it230-space-4);
}

.it230-default :deep(> p:has(> img:only-child) > img) {
    display: block;
    height: auto;
    margin: 0;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: auto;
}

.it230-default[data-list-spacing="padded"] :deep(> h1:first-child ~ ul > li),
.it230-default[data-list-spacing="padded"] :deep(> h1:first-child ~ ol > li) {
    margin-block: var(--it230-space-4);
}
</style>
