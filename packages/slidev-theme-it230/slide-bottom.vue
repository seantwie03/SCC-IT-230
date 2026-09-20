<script setup lang="ts">
import { computed } from "vue";

import SequenceEndCue from "./components/SequenceEndCue.vue";

/**
 * Where this deck sits on the course site, or null when that cannot be known.
 *
 * The site builds each deck with `--base <root>weeks/<id>/slides/`, so both the
 * site root and the week are already in the bundle. Deriving them keeps the
 * theme free of any hard-coded domain and correct under a non-default
 * `IT230_SITE_BASE`, and needs no per-deck frontmatter duplicating the
 * filename. Anything else, a dev server, the theme gallery, or a PDF export,
 * builds at `/` and has no site to point at.
 *
 * Rather than testing for those cases one by one, a link is produced only when
 * the base actually parses, so any future context without one degrades to
 * plain footer text instead of a broken href.
 */
const site = computed(() => {
    const base = import.meta.env.BASE_URL ?? "/";
    const parsed = /^(.*\/)weeks\/(w\d+)\/slides\/?$/.exec(base);
    if (!parsed) return null;
    const [, root, id] = parsed;
    return { root, week: `${root}weeks/${id}/`, label: `Week ${id.slice(1)}` };
});
</script>

<template>
    <footer class="it230-footer" aria-label="Slide footer">
        <div class="it230-footer__rule" aria-hidden="true"></div>
        <div class="it230-footer__content">
            <span>
                <a
                    v-if="site"
                    class="it230-footer__link"
                    :href="site.root"
                    aria-label="IT-230 course site"
                    >IT-230</a
                ><template v-else>IT-230</template>
                · Linux Administration
            </span>
            <span class="it230-footer__status">
                <SequenceEndCue />
                <span class="it230-footer__position">
                    <span v-if="site">
                        <a
                            class="it230-footer__link"
                            :href="site.week"
                            :aria-label="`${site.label} overview`"
                            >{{ site.label }}</a
                        >
                        ·
                    </span>
                    <SlideCurrentNo />
                </span>
            </span>
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

/*
 * The footer is `pointer-events: none` so it never intercepts a click meant
 * for the slide, which also makes anything inside it unclickable. The link
 * opts itself back in.
 *
 * The dotted underline is not decoration. Every accent measures between
 * 1.12:1 and 1.25:1 against the muted footer text, far below the 3:1 that
 * WCAG technique G183 requires before colour alone may distinguish a link from
 * the text around it, so the link needs a cue that does not depend on hue. It
 * goes solid on hover and focus.
 */
.it230-footer__link {
    color: var(--it230-color-accent-text);
    pointer-events: auto;
    text-decoration: underline dotted;
    text-underline-offset: 0.2em;
}

.it230-footer__link:hover,
.it230-footer__link:focus-visible {
    text-decoration: underline solid;
}

/*
 * The theme's focus ring is scoped to `.slidev-layout`, which does not contain
 * the footer, so this link would otherwise fall back to the browser's thin
 * default. Repeated here so a keyboard user sees the same indicator as
 * everywhere else in the deck.
 */
.it230-footer__link:focus-visible {
    border-radius: var(--it230-radius-sm);
    outline: 0.18rem solid var(--it230-color-accent-fill);
    outline-offset: 0.16rem;
}

.it230-footer__content {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding-inline: 0.2rem;
}

/*
 * The week label, the middle dot, and the slide number are one text run, so
 * the dot is spaced by ordinary word spaces like the dot on the left. The
 * status gap falls before the run, between it and the sequence cue.
 */
.it230-footer__position {
    white-space: nowrap;
}

.it230-footer__status {
    align-items: center;
    display: inline-flex;
    gap: var(--it230-space-3);
}

.slidev-page:has(.it230-cover) .it230-footer,
.slidev-page:has(.it230-section) .it230-footer {
    display: none;
}
</style>
