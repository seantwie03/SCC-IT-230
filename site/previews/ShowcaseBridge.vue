<script setup lang="ts">
/**
 * Control one isolated slide preview from the showcase page.
 *
 * The showcase embeds real slides rather than pictures of them, so each
 * preview is a separate document and the page cannot reach into it with CSS or
 * a function call. This bridge is the whole interface: it accepts messages
 * from its parent and reports what it is showing.
 *
 * It deliberately exposes nothing on `window`. A preview only ever obeys its
 * own parent frame, verified by both origin and source, so an embedded deck
 * cannot be driven by another page.
 */
import { useNav } from "@slidev/client";
import { onMounted, onUnmounted, watch } from "vue";

import {
    accentCssVariables,
    resolveIt230Accent,
} from "../../packages/slidev-theme-it230/setup/accent";

const nav = useNav();

let slot = "";
let playing = false;
let timer: ReturnType<typeof setTimeout> | undefined;

/** How long a click state holds before the preview advances itself. */
const STEP_MS = 2600 / 1.5;

/*
 * How the recording is driven.
 *
 * The player is created by a theme component that keeps its instance private,
 * so the bridge works its controls the way a viewer would. Whether it has
 * finished is inferred from its clock: the elapsed time ticks once a second
 * while it runs, so a clock that has not moved across several polls has
 * stopped.
 */
const RECORDING_POLL_MS = 600;
const RECORDING_STALL_POLLS = 4;
let recordingTimer: ReturnType<typeof setInterval> | undefined;
let recordingPlaying = false;
let recordingStarted = false;

function post(type: string, extra: Record<string, unknown> = {}) {
    window.parent.postMessage(
        {
            clicks: nav.clicks.value,
            no: nav.currentSlideNo.value,
            playing,
            slot,
            total: nav.clicksTotal.value,
            type,
            ...extra,
        },
        window.location.origin,
    );
}

function applyAccent(name: unknown) {
    const accent = resolveIt230Accent(
        typeof name === "string" && name ? name : undefined,
    );
    for (const [property, value] of Object.entries(accentCssVariables(accent)))
        document.documentElement.style.setProperty(property, value);
    document.documentElement.dataset.it230Accent = accent.name;
}

function stop() {
    clearTimeout(timer);
    timer = undefined;
    playing = false;
}

function elapsed() {
    return (
        currentRecording()?.querySelector(".ap-time-elapsed")?.textContent ?? ""
    );
}

function currentRecording() {
    // Slidev retains neighboring slides in the DOM. Their players must never
    // receive controls intended for the currently displayed recording.
    return document.querySelector<HTMLElement>(
        `[data-slidev-no="${nav.currentSlideNo.value}"] .it230-asciinema`,
    );
}

function watchRecording() {
    clearInterval(recordingTimer);
    let last = elapsed();
    let stalls = 0;
    recordingTimer = setInterval(() => {
        const now = elapsed();
        if (now === last) stalls += 1;
        else {
            stalls = 0;
            last = now;
        }
        if (stalls >= RECORDING_STALL_POLLS) {
            clearInterval(recordingTimer);
            recordingTimer = undefined;
            recordingPlaying = false;
            post("it230:recording-ended");
        }
    }, RECORDING_POLL_MS);
}

/*
 * Start or resume the replay.
 *
 * The big start overlay exists only before the first play. Once the recording
 * has been running, resuming means the control bar's own toggle, so reaching
 * for the overlay again silently does nothing and leaves the page believing it
 * is playing.
 */
function startRecording() {
    if (recordingPlaying) return;
    const recording = currentRecording();
    const control = recordingStarted
        ? recording?.querySelector<HTMLElement>(".ap-playback-button")
        : (recording?.querySelector<HTMLElement>(
              ".ap-overlay-start, .ap-play-button",
          ) ?? recording?.querySelector<HTMLElement>(".ap-playback-button"));
    if (!control) {
        post("it230:recording-ended");
        return;
    }
    control.click();
    recordingStarted = true;
    recordingPlaying = true;
    watchRecording();
}

function pauseRecording() {
    clearInterval(recordingTimer);
    recordingTimer = undefined;
    if (!recordingPlaying) return;
    currentRecording()
        ?.querySelector<HTMLElement>(".ap-playback-button")
        ?.click();
    recordingPlaying = false;
}

function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    /*
     * Stop on the final state rather than looping. A preview that restarts
     * forever competes with the page's text for attention, and the showcase
     * offers an explicit replay instead.
     */
    if (nav.clicks.value >= nav.clicksTotal.value) {
        stop();
        post("it230:state");
        return;
    }
    timer = setTimeout(async () => {
        await nav.go(
            slot,
            Math.min(nav.clicks.value + 1, nav.clicksTotal.value),
        );
        post("it230:state");
        schedule();
    }, STEP_MS);
}

async function show(alias: string, clicks = 0) {
    const known = nav.slides.value.some(
        (slide) => slide.meta?.slide?.frontmatter?.routeAlias === alias,
    );
    if (!known) return false;
    slot = alias;
    await nav.go(alias, clicks);
    return true;
}

async function receive(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;
    if (event.source !== window.parent) return;
    const data = event.data;
    if (!data || typeof data !== "object" || typeof data.type !== "string")
        return;

    switch (data.type) {
        case "it230:init": {
            if (typeof data.slot !== "string") return;
            if (data.slot !== slot) {
                pauseRecording();
                clearInterval(recordingTimer);
                recordingTimer = undefined;
                recordingPlaying = false;
                recordingStarted = false;
            }
            applyAccent(data.accent);
            const ok = await show(data.slot, 0);
            if (ok) post("it230:ready");
            return;
        }
        case "it230:accent":
            applyAccent(data.accent);
            post("it230:state");
            return;
        case "it230:play":
            if (nav.clicks.value >= nav.clicksTotal.value)
                await nav.go(slot, 0);
            playing = true;
            post("it230:state");
            schedule();
            return;
        case "it230:pause":
            stop();
            pauseRecording();
            post("it230:state");
            return;
        case "it230:recording-play":
            startRecording();
            return;
        case "it230:recording-pause":
            pauseRecording();
            return;
        case "it230:step": {
            stop();
            const next = Math.max(
                0,
                Math.min(
                    nav.clicks.value + (data.by === -1 ? -1 : 1),
                    nav.clicksTotal.value,
                ),
            );
            await nav.go(slot, next);
            post("it230:state");
            return;
        }
        case "it230:replay":
            stop();
            await nav.go(slot, 0);
            playing = true;
            post("it230:state");
            schedule();
            return;
        default:
    }
}

/*
 * A slide's click total is not known the instant it is navigated to: the
 * directives that register clicks mount with the slide. Reporting once on
 * arrival therefore reports zero and the page concludes there is nothing to
 * animate, so report again whenever the count settles.
 */
watch(
    () => [nav.clicks.value, nav.clicksTotal.value],
    () => {
        if (slot) post("it230:state");
    },
);

onMounted(() => {
    window.addEventListener("message", receive);
    document.documentElement.dataset.showcaseReady = "true";
    post("it230:mounted");
});

onUnmounted(() => {
    stop();
    clearInterval(recordingTimer);
    window.removeEventListener("message", receive);
});
</script>

<template><span hidden /></template>
