<script setup lang="ts">
import { computed } from "vue";

type VerticalAlignment = "start" | "center" | "evenly";
type HorizontalAlignment = "start" | "center" | "end";
type ListSpacing = "normal" | "padded";

const props = withDefaults(
    defineProps<{
        horizontal?: HorizontalAlignment;
        leftWidth?: number;
        listSpacing?: ListSpacing;
        vertical?: VerticalAlignment;
    }>(),
    {
        horizontal: "start",
        leftWidth: 50,
        listSpacing: "normal",
        vertical: "evenly",
    },
);

const columnWidths = computed(() => {
    if (
        !Number.isFinite(props.leftWidth) ||
        props.leftWidth <= 0 ||
        props.leftWidth >= 100
    ) {
        throw new Error(
            `Invalid two-cols-header leftWidth "${props.leftWidth}". Use a number greater than 0 and less than 100.`,
        );
    }

    return `minmax(0, ${props.leftWidth}fr) minmax(0, ${100 - props.leftWidth}fr)`;
});
</script>

<template>
    <div
        class="slidev-layout it230-two-cols-header"
        :data-horizontal="horizontal"
        :data-list-spacing="listSpacing"
        :data-vertical="vertical"
    >
        <div class="it230-two-cols-header__header">
            <slot />
        </div>
        <div
            class="it230-two-cols-header__columns"
            :style="{ gridTemplateColumns: columnWidths }"
        >
            <div class="it230-two-cols-header__column">
                <slot name="left" />
            </div>
            <div class="it230-two-cols-header__column">
                <slot name="right" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.it230-two-cols-header {
    display: grid;
    gap: var(--it230-space-4);
    grid-template-rows: auto minmax(0, 1fr);
}

.it230-two-cols-header__header,
.it230-two-cols-header__column {
    min-width: 0;
}

.it230-two-cols-header__columns {
    display: grid;
    gap: var(--it230-space-7);
    min-height: 0;
}

.it230-two-cols-header__header :deep(> :last-child),
.it230-two-cols-header__column :deep(> :last-child) {
    margin-bottom: 0;
}

.it230-two-cols-header__column {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.it230-two-cols-header[data-horizontal="center"]
    .it230-two-cols-header__column {
    align-items: center;
}

.it230-two-cols-header[data-horizontal="end"] .it230-two-cols-header__column {
    align-items: flex-end;
}

.it230-two-cols-header[data-horizontal="center"]
    .it230-two-cols-header__column
    :deep(> *),
.it230-two-cols-header[data-horizontal="end"]
    .it230-two-cols-header__column
    :deep(> *) {
    max-width: 100%;
}

.it230-two-cols-header__column :deep(> p:has(> img:only-child)) {
    align-items: center;
    display: flex;
    flex: 0 1 auto;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
    width: 100%;
}

.it230-two-cols-header__column :deep(> p:only-child:has(> img:only-child)) {
    flex: 1 1 0;
    margin: 0;
}

.it230-two-cols-header__column :deep(> img),
.it230-two-cols-header__column :deep(> p:has(> img:only-child) > img) {
    display: block;
    flex: 0 1 auto;
    height: auto;
    margin: 0;
    max-height: 100%;
    max-width: 100%;
    min-height: 0;
    object-fit: contain;
    width: auto;
}

.it230-two-cols-header__column :deep(> img:only-child) {
    flex: 1 1 0;
}

.it230-two-cols-header[data-vertical="center"] .it230-two-cols-header__column {
    justify-content: center;
}

.it230-two-cols-header[data-vertical="evenly"] .it230-two-cols-header__column {
    gap: var(--it230-space-4);
    justify-content: space-evenly;
}

.it230-two-cols-header[data-vertical="evenly"]
    .it230-two-cols-header__column
    :deep(> *) {
    margin-block: 0;
}

.it230-two-cols-header[data-list-spacing="padded"]
    .it230-two-cols-header__column
    :deep(> ul > li),
.it230-two-cols-header[data-list-spacing="padded"]
    .it230-two-cols-header__column
    :deep(> ol > li) {
    margin-block: var(--it230-space-4);
}
</style>
