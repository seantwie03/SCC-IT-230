<template>
    <footer class="it230-footer" aria-label="Slide footer">
        <div class="it230-footer__rule" aria-hidden="true"></div>
        <div class="it230-footer__content">
            <span>IT-230 · Linux Administration</span>
            <span><SlideCurrentNo /></span>
        </div>
    </footer>
</template>

<style>
.it230-footer {
    bottom: 0.55rem;
    color: var(--it230-color-muted);
    font-family: var(--it230-font-sans);
    font-size: 0.7rem;
    left: 3.75rem;
    line-height: 1;
    pointer-events: none;
    position: absolute;
    right: 3.75rem;
    z-index: 10;
}

.it230-footer__rule {
    background: linear-gradient(
        90deg,
        var(--it230-color-line) 0 52%,
        color-mix(in srgb, var(--it230-color-accent-fill) 25%, transparent) 100%
    );
    border-radius: 999px;
    height: 0.125rem;
    margin-bottom: 0.35rem;
    width: 100%;
}

.it230-footer__content {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding-inline: 0.2rem;
}

.slidev-page:has(.it230-cover) .it230-footer,
.slidev-page:has(.it230-section) .it230-footer {
    display: none;
}
</style>
