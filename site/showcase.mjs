/*
 * Showcase page controller.
 *
 * Each example on this page is a real slide rendered in its own document, so
 * the page talks to it by message rather than by reaching into it. This module
 * creates those frames when they are needed, keeps them sized so the deck sees
 * a real device viewport, and drives their playback.
 *
 * Stepping is driven from here rather than inside each frame. A device pair is
 * two independent documents, and two independent timers drift; one timer
 * sending the same step to both is the only way they stay together.
 */

const STEP_MS = 2600;

/*
 * How long a sequence rests on its first slide before advancing. Long enough
 * to read a goal and a short workflow, short enough that a visitor does not
 * conclude the example is stuck.
 */
const DWELL_MS = 4200;
const FRAME_SIZES = {
    desktop: { height: 1080, width: 1920 },
    phone: { height: 390, width: 844 },
};

/*
 * Sizes for framed web pages, as opposed to slides. A page is laid out at a
 * real width and scaled, the same as a slide, but it is a document rather than
 * a deck so nothing drives it and it needs no bridge.
 */
const PAGE_SIZES = {
    "phone-portrait": { height: 780, width: 390 },
    wide: { height: 900, width: 1280 },
};

/** Build the framed web pages once they come into reach. */
function wirePageFrame(container) {
    const src = container.dataset.frameSrc;
    if (!src) return;
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const iframe = buildFrame(container, {
                    size:
                        PAGE_SIZES[container.dataset.frameSize] ??
                        PAGE_SIZES.wide,
                    src,
                    title: container.dataset.frameTitle ?? "Course page",
                });
                pageFrames.push(iframe);
                iframe.addEventListener("load", () =>
                    paintPageFrame(iframe, currentAccentVariables()),
                );
                observer.disconnect();
            }
        },
        { rootMargin: "300px" },
    );
    observer.observe(container);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const slots = [];
/* Framed web pages, kept so a later accent change can reach into them. */
const pageFrames = [];
let active;
let accent = "blue";

const ACCENT_STORAGE = "it230:showcase-accent";

/*
 * Paint one accent across everything on the page.
 *
 * Three surfaces need telling separately. The page itself takes the custom
 * properties directly. A slide preview is a deck, so it is asked through the
 * bridge and resolves the palette itself. A framed course page is same-origin,
 * so its own custom properties can be set on it from here, which is what lets
 * an exercise carrying its week's colour follow the picker instead of sitting
 * there in a colour nothing else on the page is using.
 */
function paintAccent(button) {
    const variables = {
        "--it230-color-accent-fill": button.dataset.varFill,
        "--it230-color-accent-text": button.dataset.varText,
        "--it230-color-accent-wash": button.dataset.varWash,
    };
    accent = button.dataset.accent;

    for (const [name, value] of Object.entries(variables))
        document.documentElement.style.setProperty(name, value);
    for (const slot of slots) broadcast(slot, { accent, type: "it230:accent" });
    for (const frame of pageFrames) paintPageFrame(frame, variables);

    for (const other of document.querySelectorAll("[data-accent]"))
        other.setAttribute(
            "aria-checked",
            String(other.dataset.accent === accent),
        );
    try {
        window.sessionStorage.setItem(ACCENT_STORAGE, accent);
    } catch {
        /* A page that cannot remember the choice still works. */
    }
}

function paintPageFrame(frame, variables) {
    try {
        const root = frame.contentDocument?.documentElement;
        if (!root) return;
        for (const [name, value] of Object.entries(variables))
            root.style.setProperty(name, value);
    } catch {
        /* Not loaded yet, or not reachable. It is painted again on load. */
    }
}

function currentAccentVariables() {
    const style = document.documentElement.style;
    return {
        "--it230-color-accent-fill": style.getPropertyValue(
            "--it230-color-accent-fill",
        ),
        "--it230-color-accent-text": style.getPropertyValue(
            "--it230-color-accent-text",
        ),
        "--it230-color-accent-wash": style.getPropertyValue(
            "--it230-color-accent-wash",
        ),
    };
}

function wireAccentPicker() {
    const buttons = [...document.querySelectorAll("[data-accent]")];
    if (buttons.length === 0) return;
    for (const button of buttons)
        button.addEventListener("click", () => paintAccent(button));

    let stored;
    try {
        stored = window.sessionStorage.getItem(ACCENT_STORAGE);
    } catch {
        stored = undefined;
    }
    /*
     * Paint on load, not only when restoring a choice. Each artifact arrives
     * carrying its own week's accent, so an unpainted page shows an exercise
     * in one colour beside a slide in another and reads as a mistake. The
     * default is the same blue the site already uses.
     */
    const restore =
        buttons.find((button) => button.dataset.accent === stored) ??
        buttons.find((button) => button.dataset.accent === "blue") ??
        buttons[0];
    if (restore) paintAccent(restore);
}

function send(frame, message) {
    frame.iframe.contentWindow?.postMessage(
        { ...message },
        window.location.origin,
    );
}

function broadcast(slot, message) {
    for (const frame of slot.frames) if (frame.ready) send(frame, message);
}

/** Lay a frame out at its real width, then scale it into its container. */
function fit(container, layoutWidth) {
    const width = container.clientWidth;
    if (width > 0)
        container.style.setProperty(
            "--frame-scale",
            String(width / layoutWidth),
        );
}

/*
 * Build a scaled frame inside a container.
 *
 * The frame is decorative in both cases: a caption describes it and a link
 * beside it names the destination, so a screen reader meets one figure rather
 * than a second document per panel.
 */
function buildFrame(container, { size, src, title }) {
    const iframe = document.createElement("iframe");
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("tabindex", "-1");
    container.style.setProperty("--frame-width", `${size.width}px`);
    container.style.setProperty("--frame-height", `${size.height}px`);
    iframe.src = src;
    container.append(iframe);
    container.dataset.loaded = "true";
    new ResizeObserver(() => fit(container, size.width)).observe(container);
    fit(container, size.width);
    return iframe;
}

function updateProgress(slot) {
    if (slot.progress)
        slot.progress.textContent =
            slot.total > 0
                ? `Step ${slot.clicks + 1} of ${slot.total + 1}`
                : "";
    updateToggle(slot);
}

/*
 * Has the example reached its end?
 *
 * A stepped slide ends when its clicks run out. A sequence ends when the
 * recording it finishes on reports that it stopped, and its click total is
 * zero throughout, so the two cannot share one test. This is a single function
 * because the label and the button's action asked the question separately
 * once, drifted apart, and left a control reading Replay that resumed instead.
 */
function isFinished(slot) {
    return slot.finished || (slot.total > 0 && slot.clicks >= slot.total);
}

/*
 * One control, three states. Pausing partway leaves an example that is neither
 * playing nor finished, so a two-label button would have to offer Replay and
 * throw away the steps the viewer already watched.
 */
function updateToggle(slot) {
    if (!slot.toggle) return;
    slot.toggle.textContent = slot.playing
        ? "Pause"
        : isFinished(slot)
          ? "Replay"
          : "Play";
}

function stop(slot) {
    clearInterval(slot.timer);
    clearTimeout(slot.dwell);
    slot.timer = undefined;
    slot.dwell = undefined;
    slot.playing = false;
    if (slot.recording) broadcast(slot, { type: "it230:recording-pause" });
    updateToggle(slot);
}

/*
 * A sequence rests on its opening slide, moves to the next, and starts the
 * recording waiting there. The whole thing is one example with one control, so
 * pausing stops the timer and the replay together.
 */
function playSequence(slot) {
    if (active && active !== slot) stop(active);
    active = slot;
    slot.playing = true;
    slot.finished = false;
    updateToggle(slot);
    if (slot.stage === 1) {
        broadcast(slot, { type: "it230:recording-play" });
        return;
    }
    clearTimeout(slot.dwell);
    slot.dwell = setTimeout(() => {
        slot.stage = 1;
        broadcast(slot, { clicks: 0, slot: slot.then, type: "it230:init" });
        slot.dwell = setTimeout(() => {
            broadcast(slot, { type: "it230:recording-play" });
        }, 900);
    }, DWELL_MS);
}

function play(slot) {
    if (slot.playing) return;
    if (slot.then) return playSequence(slot);
    if (slot.total === 0) return;
    if (active && active !== slot) stop(active);
    active = slot;
    slot.playing = true;
    updateToggle(slot);
    clearInterval(slot.timer);
    slot.timer = setInterval(() => {
        if (slot.clicks >= slot.total) {
            stop(slot);
            return;
        }
        broadcast(slot, { by: 1, type: "it230:step" });
    }, STEP_MS);
}

function replay(slot) {
    stop(slot);
    slot.clicks = 0;
    slot.finished = false;
    slot.stage = 0;
    broadcast(slot, { clicks: 0, slot: slot.alias, type: "it230:init" });
    play(slot);
}

function createFrame(slot, screen) {
    const kind = screen.dataset.frame;
    const size = FRAME_SIZES[kind] ?? FRAME_SIZES.desktop;
    const iframe = buildFrame(screen, {
        size,
        src: `${document.body.dataset.previewsBase}#/${slot.alias}`,
        title: screen.dataset.frameTitle ?? "Slide preview",
    });
    return { iframe, kind, ready: false };
}

function load(slot) {
    if (slot.loaded) return;
    slot.loaded = true;
    for (const screen of slot.element.querySelectorAll("[data-frame]"))
        slot.frames.push(createFrame(slot, screen));
}

function receive(event) {
    if (event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;
    for (const slot of slots) {
        const frame = slot.frames.find(
            (candidate) => candidate.iframe.contentWindow === event.source,
        );
        if (!frame) continue;

        if (data.type === "it230:mounted") {
            frame.ready = true;
            send(frame, {
                accent,
                clicks: 0,
                slot: slot.stage === 1 ? slot.then : slot.alias,
                type: "it230:init",
            });
            return;
        }
        if (data.type === "it230:recording-ended") {
            slot.finished = true;
            stop(slot);
            return;
        }
        if (data.type === "it230:ready" || data.type === "it230:state") {
            if (typeof data.clicks === "number") slot.clicks = data.clicks;
            if (typeof data.total === "number") slot.total = data.total;
            updateProgress(slot);
            /*
             * Start once the slide reports how many steps it has. That arrives
             * after the frame is ready, because the directives that register
             * clicks mount with the slide.
             */
            if (
                slot.animated &&
                !slot.started &&
                (slot.total > 0 || slot.then) &&
                slot.frames.every((candidate) => candidate.ready)
            ) {
                slot.started = true;
                if (!reduceMotion.matches) play(slot);
            }
        }
        return;
    }
}

function wire(element) {
    const slot = {
        alias: element.dataset.slot,
        animated: element.dataset.animated === "true",
        clicks: 0,
        dwell: undefined,
        finished: false,
        recording: element.dataset.recording === "true",
        stage: 0,
        then: element.dataset.then || undefined,
        element,
        frames: [],
        loaded: false,
        playing: false,
        progress: element.querySelector("[data-progress]"),
        started: false,
        timer: undefined,
        toggle: element.querySelector("[data-toggle]"),
        total: 0,
    };
    slots.push(slot);

    slot.toggle?.addEventListener("click", () => {
        if (slot.playing) stop(slot);
        else if (isFinished(slot)) replay(slot);
        else play(slot);
    });

    /* Build the frames only as the example comes into reach. */
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                load(slot);
                observer.disconnect();
            }
        },
        { rootMargin: "300px" },
    );
    observer.observe(element);
}

function start() {
    if (!document.body.dataset.previewsBase) return;
    window.addEventListener("message", receive);
    for (const element of document.querySelectorAll("[data-slot]"))
        wire(element);
    for (const element of document.querySelectorAll("[data-frame-src]"))
        wirePageFrame(element);
    wireAccentPicker();
    reduceMotion.addEventListener("change", () => {
        if (reduceMotion.matches) for (const slot of slots) stop(slot);
    });
}

start();
