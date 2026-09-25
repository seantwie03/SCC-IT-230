/**
 * The slide examples the showcase page reserves.
 *
 * A slot is a request for an example, not a reference to a particular slide.
 * Whichever slide carries the matching `routeAlias` fills it, so featuring a
 * different example is one frontmatter edit and no change here.
 *
 * `slot` names the position on the page. `alias` names the slide that fills
 * it, and the two are usually the same. They separate when a slide deserves a
 * public address of its own: a student told to bookmark the lab reference
 * should get `#/lab-environment`, not `#/showcase-4-1`. Slidev allows one
 * `routeAlias` per slide, so a slide that has earned a meaningful name keeps
 * it and the slot points at it.
 *
 * `docs/showcase.md` owns the rules. Section numbers match the page's
 * sections, so reordering the page means renaming slots in deck sources; that
 * cost is accepted because reordering should be rare.
 */
/**
 * How much faster than real time the showcase plays its examples.
 *
 * Slide steps, the sequence dwell, and recording playback all scale by this
 * one value. Published course decks are unaffected and play in real time.
 */
export const SHOWCASE_PLAYBACK_SPEED = 1.5;

export const SHOWCASE_SLOTS = Object.freeze([
    Object.freeze({
        alias: "showcase-1-1",
        slot: "showcase-1-1",
        animated: true,
        devicePair: true,
        section: 1,
    }),
    Object.freeze({
        alias: "showcase-2-1",
        slot: "showcase-2-1",
        animated: true,
        devicePair: false,
        section: 2,
    }),
    Object.freeze({
        alias: "showcase-3-1",
        slot: "showcase-3-1",
        animated: false,
        devicePair: false,
        section: 3,
    }),
    Object.freeze({
        alias: "lab-environment",
        slot: "showcase-4-1",
        animated: false,
        devicePair: false,
        section: 4,
    }),
    /*
     * The recording a student replays alone. A different exercise from the one
     * We Do uses: repeating it would read as the page running out of material.
     */
    Object.freeze({
        alias: "showcase-6-1",
        slot: "showcase-6-1",
        animated: true,
        recording: true,
        devicePair: false,
        section: 6,
    }),
    /*
     * A sequence rather than a single slide: the exercise is stated, then it
     * becomes the recorded demonstration of that same exercise. `then` is the
     * slide it advances to, and `recording` asks the page to start the replay
     * once it arrives.
     */
    Object.freeze({
        alias: "showcase-5-1",
        slot: "showcase-5-1",
        then: "showcase-5-2",
        recording: true,
        animated: true,
        devicePair: false,
        section: 5,
    }),
]);

export const SHOWCASE_SLOT_ALIASES = Object.freeze(
    SHOWCASE_SLOTS.flatMap((slot) =>
        slot.then ? [slot.alias, slot.then] : [slot.alias],
    ),
);

export function showcaseSlotByAlias(alias) {
    return SHOWCASE_SLOTS.find((entry) => entry.alias === alias);
}

export function showcaseSlotById(slot) {
    return SHOWCASE_SLOTS.find((entry) => entry.slot === slot);
}
