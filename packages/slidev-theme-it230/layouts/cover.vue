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
