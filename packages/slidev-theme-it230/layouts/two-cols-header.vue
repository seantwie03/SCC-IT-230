<template>
    <div class="slidev-layout it230-two-cols-header">
        <div class="it230-two-cols-header__header">
            <slot />
        </div>
        <div class="it230-two-cols-header__columns">
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: 0;
}

.it230-two-cols-header__header :deep(> :last-child),
.it230-two-cols-header__column :deep(> :last-child) {
    margin-bottom: 0;
}
</style>
