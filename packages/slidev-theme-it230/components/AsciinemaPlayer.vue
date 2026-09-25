<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from "vue";

import * as AsciinemaPlayer from "asciinema-player";
import "asciinema-player/dist/bundle/asciinema-player.css";

/**
 * Embed a terminal session recording as replayable text.
 *
 * The player renders real DOM text rather than a raster frame, so the
 * recording stays selectable, scalable, and pausable. `autoPlay` stays off so
 * the slide never carries auto-starting motion, and `controls` is forced on
 * because the player's own "auto" default only reveals them on pointer
 * movement, which excludes touch and keyboard users.
 *
 * The colour palette and terminal size come from the recording itself, so no
 * `theme` option is passed. `poster` is a fixed two seconds because the cast
 * post-processor trims every recording to begin on its opening section
 * header, which is the frame worth showing in a PDF export.
 *
 * Wraps asciinema-player (https://github.com/asciinema/asciinema-player) by
 * Marcin Kulik, used under the Apache License 2.0. Its script and stylesheet
 * are bundled into the built site, so that licence governs part of what this
 * repository publishes. The package ships the full licence text as its own
 * LICENSE file and carries no NOTICE file, so no NOTICE has to be propagated.
 */
const props = withDefaults(
    defineProps<{
        /** URL of the asciicast. Import it with Vite's `?url` suffix. */
        src: string;
        /** Describes the recorded workflow for assistive technology. */
        label: string;
        /** Static frame shown before playback, in `npt:` notation. */
        poster?: string;
    }>(),
    { poster: "npt:0:02" },
);

const host = ref<HTMLElement | null>(null);
// An embedding app may choose its pace; ordinary course decks use real time.
const playbackSpeed = inject<number>("it230-recording-speed", 1);
let player: { dispose?: () => void } | null = null;

onMounted(() => {
    if (!host.value) return;

    player = AsciinemaPlayer.create(props.src, host.value, {
        autoPlay: false,
        controls: true,
        fit: "both",
        poster: props.poster,
        speed: playbackSpeed,
    });
});

onBeforeUnmount(() => {
    player?.dispose?.();
    player = null;
});
</script>

<template>
    <div
        ref="host"
        class="it230-asciinema"
        role="group"
        :aria-label="label"
    ></div>
</template>

<style scoped>
/*
 * `fit: both` measures this element to size the terminal, so it has to be an
 * ordinary block with definite dimensions. Making it a flex container instead
 * collapses the player's own wrapper to zero width, because the player then
 * has nothing to measure before it lays itself out.
 */
.it230-asciinema {
    display: block;
    height: 100%;
    width: 100%;
}

/*
 * The theme turns Slidev's `selectable` on, so slide text is already
 * selectable. This keeps the terminal selectable even if a deck turns it back
 * off, because copying commands out of a recording is the main reason this is
 * a player rather than a GIF. Only the terminal is covered, so the control bar
 * keeps the player's own `user-select: none`.
 */
.it230-asciinema :deep(.ap-term) {
    user-select: text;
}
</style>
