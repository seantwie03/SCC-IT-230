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
    box-shadow: 0 0.35rem 1rem var(--it230-color-accent-wash);
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
        circle at center,
        color-mix(in srgb, var(--it230-color-accent-fill) 22%, transparent),
        color-mix(in srgb, var(--it230-color-accent-fill) 4%, transparent) 36%,
        transparent 68%
    );
    border-radius: 50%;
    height: 36rem;
    left: var(--it230-accent-origin-x);
    position: absolute;
    top: var(--it230-accent-origin-y);
    transform: translate(-50%, -50%);
    width: 36rem;
}
</style>
