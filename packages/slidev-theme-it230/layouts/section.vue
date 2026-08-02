<template>
    <div class="slidev-layout it230-section">
        <div class="it230-section__accent" aria-hidden="true"></div>
        <div class="it230-section__marker" aria-hidden="true"></div>
        <div class="it230-section__content">
            <div class="it230-eyebrow">
                <slot name="kicker">IT-230 · Linux Administration</slot>
            </div>
            <div class="it230-section__body">
                <slot />
            </div>
        </div>
    </div>
</template>

<style scoped>
.it230-section {
    align-items: center;
    display: grid;
    gap: var(--it230-space-6);
    grid-template-columns: 0.45rem minmax(0, 1fr);
}

.it230-section__marker {
    align-self: stretch;
    background: var(--it230-color-accent-fill);
    border-radius: 999px;
    box-shadow: 0 0.35rem 1rem rgb(53 132 228 / 18%);
    max-height: 15rem;
}

.it230-section__content {
    max-width: 52rem;
}

.it230-section__body :deep(h1) {
    font-size: 3rem;
    max-width: 16ch;
}

.it230-section__body :deep(p) {
    color: var(--it230-color-muted);
    font-size: 1.3rem;
    max-width: 48ch;
}

.it230-section__accent {
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
