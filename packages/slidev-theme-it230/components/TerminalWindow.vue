<script setup lang="ts">
withDefaults(
    defineProps<{
        rows?: number;
        title?: string;
    }>(),
    {
        rows: 0,
        title: "Terminal",
    },
);
</script>

<template>
    <div
        class="it230-terminal"
        role="region"
        :aria-label="title"
        :style="rows > 0 ? { '--it230-terminal-rows': rows } : undefined"
    >
        <div class="it230-terminal__bar" aria-hidden="true">
            <span
                class="it230-terminal__controls it230-terminal__controls--start"
            >
                <span class="it230-terminal__control">
                    <svg class="it230-terminal__icon" viewBox="0 0 16 16">
                        <rect
                            x="2.75"
                            y="2.75"
                            width="10.5"
                            height="10.5"
                            rx="1.5"
                        />
                        <path d="M8 5.25v5.5M5.25 8h5.5" />
                    </svg>
                </span>
                <span class="it230-terminal__separator"></span>
                <span class="it230-terminal__control">
                    <svg class="it230-terminal__icon" viewBox="0 0 16 16">
                        <path d="m4.75 6.25 3.25 3.5 3.25-3.5" />
                    </svg>
                </span>
            </span>
            <span class="it230-terminal__title">{{ title }}</span>
            <span
                class="it230-terminal__controls it230-terminal__controls--end"
            >
                <span class="it230-terminal__control">
                    <svg
                        class="it230-terminal__icon it230-terminal__icon--overview"
                        viewBox="0 0 16 16"
                    >
                        <rect
                            x="2.5"
                            y="2.5"
                            width="4.25"
                            height="4.25"
                            rx="0.6"
                        />
                        <rect
                            x="9.25"
                            y="2.5"
                            width="4.25"
                            height="4.25"
                            rx="0.6"
                        />
                        <rect
                            x="2.5"
                            y="9.25"
                            width="4.25"
                            height="4.25"
                            rx="0.6"
                        />
                        <rect
                            x="9.25"
                            y="9.25"
                            width="4.25"
                            height="4.25"
                            rx="0.6"
                        />
                    </svg>
                </span>
                <span class="it230-terminal__control">
                    <svg class="it230-terminal__icon" viewBox="0 0 16 16">
                        <path d="M3 4.25h10M3 8h10M3 11.75h10" />
                    </svg>
                </span>
                <span class="it230-terminal__control it230-terminal__close">
                    <svg
                        class="it230-terminal__icon it230-terminal__icon--close"
                        viewBox="0 0 16 16"
                    >
                        <path d="m5 5 6 6M11 5l-6 6" />
                    </svg>
                </span>
            </span>
        </div>
        <div class="it230-terminal__body">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.it230-terminal {
    background: var(--it230-color-surface);
    border: 1px solid var(--it230-color-line);
    border-radius: var(--it230-radius-md);
    box-shadow: var(--it230-shadow-raised);
    color: var(--it230-color-text);
    margin-bottom: var(--it230-space-4);
    overflow: visible;
}

.it230-terminal__bar {
    align-items: center;
    background: var(--it230-color-raised);
    border-bottom: 1px solid var(--it230-color-line);
    border-radius: calc(var(--it230-radius-md) - 1px)
        calc(var(--it230-radius-md) - 1px) 0 0;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    min-height: 1.55rem;
    padding: 0.08rem 0.35rem;
}

.it230-terminal__controls {
    align-items: center;
    display: flex;
    gap: 0.12rem;
}

.it230-terminal__controls--start {
    justify-self: start;
}

.it230-terminal__controls--end {
    justify-self: end;
}

.it230-terminal__control {
    align-items: center;
    color: var(--it230-color-text);
    display: inline-flex;
    height: 1.2rem;
    justify-content: center;
    width: 1.2rem;
}

.it230-terminal__icon {
    fill: none;
    height: 0.76rem;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
    width: 0.76rem;
}

.it230-terminal__separator {
    background: var(--it230-color-line);
    height: 0.75rem;
    width: 1px;
}

.it230-terminal__icon--overview {
    fill: currentColor;
    stroke: none;
}

.it230-terminal__title {
    color: var(--it230-color-text);
    font-family: var(--it230-font-sans);
    font-size: 0.68rem;
    font-weight: 750;
    justify-self: center;
    letter-spacing: 0;
}

.it230-terminal__close {
    background: color-mix(in srgb, var(--it230-color-line) 62%, transparent);
    border-radius: 999px;
    height: 0.96rem;
    margin-left: 0.08rem;
    width: 0.96rem;
}

.it230-terminal__icon--close {
    height: 0.56rem;
    transform: translateY(-0.01rem);
    width: 0.56rem;
}

.it230-terminal__body {
    font-family: var(--it230-font-mono);
    font-size: 1.05rem;
    font-weight: var(--it230-font-weight-code);
    line-height: 1.55;
}

/*
 * `rows` reserves the height of a transcript that grows across click states.
 * Without it the frame is only as tall as the current state, so a centred
 * layout re-centres on every click and the whole transcript drifts. Reserving
 * the final line count keeps the frame still and lets content fill into it,
 * which is also how a real terminal behaves.
 *
 * The reservation is applied to the code block in `lh` units so that one row
 * is exactly one rendered line of that block, whatever font size and line
 * height it resolves to.
 */
.it230-terminal__body :deep(pre),
.it230-terminal__body :deep(.slidev-code) {
    min-block-size: calc(
        var(--it230-terminal-rows, 0) * 1lh + 2 *
            var(--slidev-code-padding, 0px)
    );
}

.it230-terminal__body :deep(pre),
.it230-terminal__body :deep(.slidev-code) {
    background: transparent !important;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: inherit;
    margin: 0;
    overflow: visible;
}

.it230-terminal__body :deep(.slidev-code-copy) {
    display: none;
}

/*
 * Line numbers reach the page two different ways, and neither is stable on its
 * own. An ordinary code block draws them with a `::before` counter in a fixed
 * 1rem box, while Magic Move emits them as real tokens whose text is padded to
 * the digit count of that state. A transcript that grows past nine lines
 * therefore widens its own gutter partway through the sequence, shifting every
 * line sideways.
 *
 * Both are normalized to one fixed two-digit gutter so the code starts at the
 * same place in every state and in both renderers.
 */
.it230-terminal__body :deep(.slidev-code code .line::before),
.it230-terminal__body :deep(.shiki-magic-move-line-number) {
    color: var(--it230-color-muted);
    opacity: 1;
}

/*
 * Only the ordinary code block needs a box: its counter has no width of its
 * own. Magic Move already pads each number to the digit count of its state and
 * follows it with two spaces, and it positions the rest of the line from that
 * text, so adding a width or margin here would indent the code twice.
 */
.it230-terminal__body :deep(.slidev-code code .line::before) {
    width: 2ch;
    margin-right: 1.25rem;
    text-align: right;
}

/*
 * Magic Move writes its number as text (the digit padded to that state's digit
 * count, then two spaces) and lays the line out from that text. It therefore
 * indents further than the counter above, which draws into a fixed box. Pulling
 * the following token back by those three characters lines the two renderers up.
 *
 * Giving this token a width instead does not work: a fixed box leaves the text
 * to set the indent anyway, and the block formatting context it creates also
 * changes the line height.
 */
.it230-terminal__body :deep(.shiki-magic-move-line-number) {
    margin-right: -3ch;
}

.it230-terminal__body :deep(p:last-child) {
    margin-bottom: 0;
}
</style>
