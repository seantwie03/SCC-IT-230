<script setup lang="ts">
withDefaults(
    defineProps<{
        code?: boolean;
        italic?: boolean;
        normal?: boolean;
    }>(),
    {
        code: false,
        italic: false,
        normal: false,
    },
);
</script>

<template>
    <span
        :class="[
            'it230-color-text',
            {
                'it230-color-text--italic': italic,
                'it230-color-text--code': code,
                'it230-color-text--normal': normal,
            },
        ]"
        ><slot
    /></span>
</template>

<style scoped>
.it230-color-text {
    color: var(--it230-color-success);
    font-weight: var(--it230-font-weight-bold);
}

.it230-color-text.it230-color-text--normal {
    font-weight: var(--it230-font-weight-regular);
}

.it230-color-text--italic {
    font-style: italic;
}

.it230-color-text--code {
    font-family: var(--it230-font-mono);
}
</style>
