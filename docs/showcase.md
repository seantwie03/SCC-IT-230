# Showcase

## Purpose

`/showcase/` is a public page aimed at colleagues, other faculty, and college
leadership. It explains what the course materials do for a student. It is not a
student-facing surface and it does not teach a topic.

A companion student-facing `/overview/` page is planned and is not built.

## This document is the only place showcase rules live

Everything about the showcase belongs here: its design, its content rules, how
its examples are chosen, and how it is built. Other documents carry at most a
one-line pointer.

The reason is practical. Most work in this repository is authoring a week of
course material, and an agent or maintainer doing that should not have to read
past showcase material to find what applies to them. `docs/architecture.md`
records only that the route exists and that this document owns the rest.

When showcase behavior changes, change this file. Do not copy its rules into
`docs/course-authoring.md`, `docs/design-system.md`, or
`docs/accessibility.md`.

Two narrow exceptions, because they are facts about shared machinery rather
than about the showcase:

- `docs/architecture.md` records the route, and records that the presentation
  catalog retains where each route alias resolved.
- `docs/accessibility.md` continues to own the repository-wide accessibility
  target. This page is held to it like every other public page.

## Relationship to the design system

`docs/design-system.md` is the contract for the `slidev-theme-it230` package:
slide layouts, shared components, theme tokens, and the gallery. It governs
what happens on a slide.

**The showcase is not bound by that contract.** It is a site page, and it is
the one surface written for colleagues rather than students, so it may use
treatments that would be wrong in a classroom deck. Device frames, an accent
picker, and scroll-triggered motion are all reasonable here and none of them
need to be added to the theme.

What the showcase does owe the rest of the site is **continuity**. A visitor
moving from a weekly overview to this page should feel one site, not two.
Concretely:

- Use the site's existing color tokens, type stacks, spacing scale, and rounded
  geometry rather than introducing a parallel set.
- Keep the sticky course header, the footer rule, and the content width that
  every other site page uses.
- Take accent colors from the central resolver in the theme package. Do not
  hard-code hex values or duplicate the named palette in site styles.
- Meet the same contrast floor and focus-visibility treatment as the rest of
  the site.

The test to apply when something new is proposed for this page: would a
visitor notice they had left the course site? If yes, reconsider. If no, the
treatment is fine even when nothing like it exists in the theme.

When a showcase treatment turns out to be genuinely useful elsewhere on the
site, move it into the shared stylesheet and note it in the design system at
that point, not before.

## Page structure

The page is a hero, an accent picker, four groups, and a closing set of links.
The groups follow the course's own gradual release of responsibility, which
`docs/course-authoring.md` owns:

- **I Do: the instructor demonstrates.** Deconstruction: show the whole thing,
  then take it apart. Theory in words, theory applied. Built to be bookmarked.
- **We Do: the class works through it together.** Practice while the support is
  still there.
- **You Do: the student works alone.** The material is still there. Knowing
  what to study next.
- **At every stage.** Accessible in every phase. Where students already are.

### The group headings are signposts, not acts

Each group heading is a label with at most one line beneath it. Every section
below it carries its own student obstacle, its own feature, and its own
evidence.

**A section must make complete sense with its group heading removed.** A reader
who arrives from a link lands on a section, not on the page. If a section only
works because of the framing above it, that framing belongs inside the section.
This is the rule that stops the groups turning into a narrative that has to be
read in order.

Name the phase and gloss it in the same line, so a reader who does not know the
model is never stopped: "I Do: the instructor demonstrates". Name gradual
release of responsibility once, in the hero, and never again. A label that
needs a paragraph of explanation is the wrong label.

### Heading levels

The page title is `h1`, the four group labels are `h2`, and the sections are
`h3`. No level is skipped.

## Design and content rules

The rules that hold whatever the page grows into:

- Every section names a student obstacle before it names a feature.
- Ease of course authoring is not an argument on this page. Neither is the
  presentation framework underneath it.
- The page never claims WCAG conformance, never claims the supplemental PDF is
  accessible, and never implies content posts to Canvas automatically.
- A contrast figure on the page has to come from a check that actually runs.
  The accent picker's note cites the floors asserted in
  `packages/slidev-theme-it230/tests/accent.test.mjs`, which `pnpm check`
  runs for all nine accents: accent text at 5.68:1 and accent fills at 3:1,
  each against every background the theme puts them on. Stating a floor is
  not stating conformance, so the note says so in the same breath.
- Each slide example is labeled with the week it comes from, and its links lead
  to that same week.
- A web page shown on the showcase is either a live frame or a derived excerpt,
  never hand-written prose describing it. A hand-written excerpt drifts from the
  page it claims to show and nothing catches it. The two exercises are live
  frames. The weekly overview is an excerpt built by `buildWeeklyView`, the same
  builder the real page uses, so it cannot describe a week differently from the
  week itself.

## Slide examples

The page shows real slides. It reserves slots named
`showcase-<section>-<position>`, and a slot displays whichever slide carries
the matching `routeAlias`.

To change which slide a slot shows, move that `routeAlias` to the new slide and
remove it from the old one. Nothing else changes, because no slide number is
recorded outside the deck.

A slot's name and the alias that fills it are usually identical, but they are
separate fields and a slot may point at any alias. Use that when a slide
deserves a public address of its own: a student told to bookmark the lab
reference should land on `#/lab-environment`, not `#/showcase-4-1`. Slidev
allows one `routeAlias` per slide, so a slide that has earned a meaningful name
keeps it and the slot points at it rather than renaming it.

Rules:

- A slot alias must be unique across its deck, like any route alias.
- Adding a slot alias to a slide that carries no `topicInfo` does not add that
  slide to the week's agenda.
- A slot that resolves to no slide, or to more than one published week, must
  fail validation with a message naming the slot.
- Because the number tracks the page's section, reordering the page means
  renaming aliases in deck sources. This is accepted; reordering should be rare.

Some slots render as a **device pair**: a laptop frame and a phone frame in
landscape showing the same slide at the same click state, advancing together.
Phone frames are landscape only, because a 16:9 slide in portrait fills about a
quarter of the screen and would misrepresent the deck. Device chrome is drawn
with original CSS or inline SVG in neutral colors, never a stock photograph and
never a recognizable manufacturer's hardware.

## Current state

The page exists and is built by the same artifact generator as every other site
page. All of its sections are built: the hero, the three phase groups, the
accent picker, and the closing links.

Its slide examples are real slides, not images. A generated Slidev deck
importing just the slides the page references is built into a content addressed
cache under `.cache/showcase-previews/`, published at `/showcase/previews/`,
and embedded per example. `site/previews/ShowcaseBridge.vue` is the only way
the page and an embedded slide talk to each other: the page sends it a slot to
show, an accent, and step commands, and it reports back what it is showing.

Stepping is driven by the page rather than inside each frame, because a device
pair is two separate documents and two independent timers drift apart.

The static fallback for a visitor without JavaScript is not built. It is
recorded under Known gaps below.

## Build and validation

Nothing about the showcase has its own build command, because the page cannot
be built in isolation: it embeds slides and links into the week routes, so a
partial build would only produce something misleading. It is built by
`pnpm run build:site` along with the rest of the site, and by `pnpm preview`
and `pnpm dev` through the same library.

`pnpm dev` does build slides, just not the week decks. `loadCourseSite` in
`scripts/lib/development.mjs` calls `buildShowcasePreviews` on every load,
outside the render worker because it runs Slidev as a subprocess, and serves
the result under `/showcase/previews/`. The bundle holds only the featured
slides, and it is content addressed, so the first load after a featured slide
changes builds one small deck and every reload after that reuses it.

The entry points name the required slots; the libraries default to none. A
build of the published course passes `SHOWCASE_SLOT_ALIASES`, so a slot whose
alias no longer matches a slide fails the build instead of publishing a gap.
The synthetic course used by `check-site.mjs` carries no aliases and must still
build.

The bundle cache under `.cache/showcase-previews/` is bounded. A new
fingerprint appears whenever a featured slide, the theme, the bridge, or the
lockfile changes, and each bundle is several megabytes, so
`buildShowcasePreviews` keeps the bundle in use plus the most recently built of
the rest and removes the others. A bundle with no completion marker is left
alone until it is old enough to be clearly abandoned rather than in progress.
Eviction failures are ignored: the cache is disposable and is not worth failing
a build over.

`pnpm run check:showcase` reviews the built page in a browser. It needs
`dist/showcase/index.html` and says so if it is missing, rather than starting a
site build of its own. `pnpm check` runs it after `check:links`, where the
build it depends on has already happened.

The check brings every example into view, because examples build their frames
only as they come into reach, and waits for each frame to report that it
rendered. A slide frame reports through the bridge, the same signal the page
waits for; a page frame is an ordinary document and reports by loading. This is
what catches a broken preview bundle, which is otherwise silent: the page still
builds, still reads correctly, and every claim on it quietly loses its
evidence.

Each device screen lays its slide out at a real device viewport and scales it
down, so the frame's layout width is legitimately far wider than its box. The
reflow rule used for exercises looks for exactly that shape, treating an
ancestor that clips wider content as a loss of information at a narrow width.
Here it is not: the content is visible, only smaller. `.device-screen` and
`.doc-screen` are therefore exempt from that one rule. The exemption is narrow
on purpose, and the page-level test for horizontal scrolling has none, so a
genuine overflow anywhere on the page still fails. Removing the exemption
reports the frames and nothing else, which is how to confirm the rule is still
live.

Axe runs against the page, not the decks inside its frames. Those are separate
documents reviewed by `pnpm run check:slides`. The page is read with reduced
motion requested, which is both the steadier thing to measure and the state a
visitor who asked not to be moved gets.

## Known gaps

Recorded while building the page section by section. None of these block
further sections; all of them should be closed before the page is offered for
publication review.

### Automated review is not a conformance claim

`pnpm run check:showcase` covers what an automated rule can decide. It does not
judge keyboard use, reading order, assistive-technology behavior, or whether
the recording's pause control is reachable in practice, and the page carries an
82-second autoplaying recording that WCAG 2.2.2 gives requirements for. The
manual review in `docs/accessibility.md` is still required before the page is
offered for publication review.

### No fallback without JavaScript

The page script creates the preview frames, so with JavaScript unavailable a
slot renders its caption and its link to the live slide but no picture. A still
first frame would close this. The page stays usable and every claim still has a
working link, so this is a degradation rather than a break.

### Playback stops one step late

An animated example stops on its final state, but the check happens on the
following tick, so its controls briefly still read as playing. Cosmetic.

### Bundle weight is unmeasured

The preview bundle is about 6MB on disk, largely because Mermaid ships every
diagram type. Those are lazily loaded chunks, so a visitor should only fetch
what a featured slide actually uses, and a device pair boots two frames. The
real transfer and time to first paint have not been measured on a page
carrying several examples.
