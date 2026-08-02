<template>
    <div class="slidev-layout it230-cover">
        <div class="it230-cover__accent" aria-hidden="true"></div>
        <div class="it230-cover__content">
            <div class="it230-eyebrow">
                <slot name="kicker">IT-230 · Linux Administration</slot>
            </div>
            <div class="it230-rule" aria-hidden="true"></div>
            <div class="it230-cover__body">
                <slot />
            </div>
        </div>
    </div>
</template>

<style scoped>
.it230-cover {
    align-items: center;
    display: flex;
    overflow: hidden;
    position: relative;
}

.it230-cover__content {
    max-width: 78%;
    position: relative;
    z-index: 1;
}

.it230-cover__body {
    margin-top: var(--it230-space-6);
}

.it230-cover__body :deep(h1) {
    font-size: 3.35rem;
    margin-bottom: var(--it230-space-5);
    max-width: 15ch;
}

.it230-cover__body :deep(p) {
    color: var(--it230-color-muted);
    font-size: 1.35rem;
    max-width: 42ch;
}

.it230-cover__accent {
    background: radial-gradient(
        circle at 45% 42%,
        rgb(53 132 228 / 22%),
        rgb(205 231 255 / 16%) 36%,
        transparent 68%
    );
    border-radius: 50%;
    height: 36rem;
    position: absolute;
    right: -10rem;
    top: -10rem;
    width: 36rem;
}
</style>
