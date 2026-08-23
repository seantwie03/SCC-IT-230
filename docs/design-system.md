# Design System

## Purpose and responsibility

The local `slidev-theme-it230` package provides the shared visual language for
IT-230 presentations. It owns visual tokens, ordinary slide styling, reusable
layouts, reusable components, and the focused theme gallery. Course-specific
explanations, examples, and composition remain in course content.

The theme is light-first. A near-white canvas and dark text support the
instructor's visual preference and students who find sustained dark-theme
reading difficult. The minimum theme does not provide a dark counterpart.

The visual language is Adwaita-inspired. It translates [Adwaita's](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/) semantic
light surfaces, named accent palette, typography, rounded geometry, and
restrained depth into presentation-scale choices. It is an original
presentation system, not an exact reproduction of a particular GNOME or RHEL
release and not an SCC or Red Hat brand treatment.

The course landing page in `site/` uses the same fixed light tokens and font
stacks. It adapts libadwaita's header-bar, document-text, boxed-list, card, and
view patterns to semantic HTML while remaining a course website rather than
simulating an application window.

The theme owns one original terminal favicon used across Slidev presentations,
the landing page, weekly details, Canvas-authoring utilities, and standalone
exercises. Its blue rounded frame, dark terminal surface, and white `>_` prompt
use the theme's global blue accent and fixed neutral colors. Keep the geometry
simple and free of institutional or vendor marks so it remains recognizable at
browser-tab sizes. Slidev serves and copies it from the theme's `public/`
directory; the site artifact generator publishes that same source at the site
root.

### Weekly overview

The landing page is a compact list of published weeks. Each item shows only the
week title, summary, and a two-action footer so a full semester remains easy to
scan. The title and primary Week overview action open the detail page; the
secondary Open presentation action launches Slidev in a new tab. The action row
wraps on narrow screens. The landing page and weekly detail pages use the same
content width. The sticky course number and title both link back to that list.

Each detail page is one document-like weekly overview with neutral Before
class, In class, required After class labs, and optional After class reading
sections stacked vertically. Labels and semantic headings establish that
sequence; color is reinforcement only. Instructional pretext beneath the Red
Hat Academy and RHCSA Cert Guide headings explains the expected student action
before the corresponding lists. Meeting Agenda pretext follows the presentation
actions because it introduces the topic list rather than those controls. The lab
phase always directs students to complete that week's assignments in Canvas and
never embeds the labs in this repository. Keep it separate from the optional
RHCSA Cert Guide phase. The
browser presentation is the prominent action and the supplemental PDF is
visually secondary. Agenda exercises remain grouped beneath their owning topic.
Each agenda topic title is the deep link to that topic's opening slide, so
there is no separate “Slides” row. Slide and presentation links open in a new
tab so the weekly overview remains available while students use Slidev; the
accessible name carries that behavior, so do not add a manual external-link
icon. Previous week, All weeks, and Next week navigation follows published
catalog order and omits an unavailable adjacent-week link.

This document owns the heading map that `docs/accessibility.md` requires. On
the landing page, materials use `h2` and week cards use `h3`. On a detail page,
the week uses `h1`, phases use `h2`, and agenda topics use `h3`. Canvas
supplies its page title outside the exported fragment, so the fragment uses
week `h2`, phase `h3`, and agenda topic `h4`. Exercises are list items rather
than a deeper heading level, and no surface skips a level.

Each site's week overview inherits the accent selected by its deck. The central
resolver in `packages/slidev-theme-it230/setup/accent.ts` supplies those CSS
variables and the global blue fallback; `site/styles.css` must not duplicate
the named palette. Before/In/After surfaces stay neutral so multiple phase
colors do not compete with deck identity.

### Exercise documents

Standalone HTML exercises visually continue the weekly detail page. They use
the same fixed light tokens, textured canvas gradient, `64rem` content width,
sticky course header, responsive gutters, raised white document surface, and
accent-gradient document header. The exercise overview and ordered steps stack
inside that single surface with separators. Step headings use the same accent
left rule as weekly phase headings, with a small numbered step label. Do not
turn individual steps into cards; reserve inset treatments for code blocks,
warnings, and notes. A single `← Back to week overview` link appears beneath
the document surface instead of competing with the course identity in the
sticky header. The landing page, weekly detail pages, and exercise documents
all repeat the slide footer's rounded two-part rule: neutral on the left and
fading into the active accent on the right.

Exercise source uses the global blue accent as a direct-open fallback. Each
published week injects its resolved fill, text, and wash properties after the
source styles, allowing a reused exercise to match every importing week.
Warning colors remain fixed and labels or structure continue to carry meaning
without color.

The Canvas fragment uses conservative semantic HTML and inline styles from the
fixed IT-230 light palette. It does not depend on site classes, custom
properties, scripts, or a style element, and it must remain understandable if
Canvas strips the optional inline presentation. Its links also omit a manual
external-link icon because Canvas renders its own. Its unlinked authoring
utility uses the ordinary course-site theme, presents the encoded fragment in a
labeled read-only text area, and provides a copy button with a
keyboard-selectable fallback.

## Design principles

- Prioritize classroom readability over decorative density.
- Keep ordinary Markdown useful without custom Vue markup.
- Keep commands and output as large, selectable text on light surfaces.
- Use color as reinforcement, never as the only indicator of meaning.
- Pair semantic colors with labels, symbols, structure, or multiple cues.
- Prefer a small stable interface to speculative layouts and components.
- Use Adwaita as a neutral Linux reference while keeping treatments original.
- Keep ordinary slides recognizably presentations, not simulated application
  windows.
- Use the deck accent for identity and fixed semantic colors for status.

## Accessibility contract

The repository-wide standard and shared validation requirements live in
`docs/accessibility.md`. This document owns their visual and theme-level
implementation.

Normal-sized text must reach at least a 4.5:1 contrast ratio against every
surface where the theme intends to use it. Large text and meaningful graphical
boundaries must reach at least 3:1. Stronger contrast is preferred when it does
not impair hierarchy.

Validate every intended text and surface pairing against the applicable
threshold whenever the palette changes. Passing contrast thresholds is a
minimum check, not a complete accessibility claim. Browser and Zoom
review must also check type size and weight, spacing, focus visibility,
overflow, and color-independent meaning.

## Visual foundations

### Color

`packages/slidev-theme-it230/styles/theme.css` is authoritative for fixed
colors, and `packages/slidev-theme-it230/setup/accent.ts` is authoritative for
the selectable accent palette. This document defines each token's semantic
responsibility and usage contract.

| Token                       | Responsibility                         |
| --------------------------- | -------------------------------------- |
| `--it230-color-canvas`      | Main slide canvas                      |
| `--it230-color-surface`     | Cards, terminals, and primary surfaces |
| `--it230-color-raised`      | Headers and secondary surfaces         |
| `--it230-color-line`        | Borders and separators                 |
| `--it230-color-text`        | Primary text                           |
| `--it230-color-muted`       | Secondary text                         |
| `--it230-color-accent-text` | Links and informational text           |
| `--it230-color-accent-fill` | Adwaita-derived deck identity fill     |
| `--it230-color-accent-wash` | Subtle canvas depth                    |
| `--it230-color-success`     | Labeled successful or helpful states   |
| `--it230-color-warning`     | Labeled warning states                 |
| `--it230-color-danger`      | Labeled caution or dangerous states    |

Do not place these colors on arbitrary backgrounds. Use the intended theme
surfaces or verify the new pairing independently.

The canvas combines a near-white base, a restrained selected-accent wash, and
an original low-opacity procedural texture. The texture creates quiet
desktop-like depth; it is not a copied GNOME asset and must remain visually
secondary. Keep cards, code, terminals, and any surface where texture could
impair reading flat and high contrast.

### Deck accent selection

A presentation may select one named Adwaita accent for its complete deck:

```yaml
themeConfig:
  it230Accent: purple
```

The supported values are `blue`, `teal`, `green`, `yellow`, `orange`, `red`,
`pink`, `purple`, and `slate`. Omitting `themeConfig.it230Accent` uses `blue`.
The value is case-sensitive. Unknown names, arbitrary color values, nulls, and
per-slide accent settings are not supported. During local authoring, an invalid
deck accent displays a blocking in-slide configuration error with the rejected
value and supported names. Repository review and build commands reject the same
configuration before starting Slidev.

For Bash-heavy presentations, prefer the cool `blue`, `teal`, `green`,
`purple`, or `slate` accents. Syntax and terminal colors remain fixed across
deck accents; warm `yellow`, `orange`, and `red` can compete visually with that
palette and with status colors.

The central resolver in
`packages/slidev-theme-it230/setup/accent.ts` owns the complete palette and its
semantic roles:

| Accent | Adwaita fill | Theme text |
| ------ | ------------ | ---------- |
| Blue   | `#3584e4`    | `#0461be`  |
| Teal   | `#2190a4`    | `#006e80`  |
| Green  | `#3a944a`    | `#15732d`  |
| Yellow | `#bd8000`    | `#905300`  |
| Orange | `#ed5b00`    | `#b62200`  |
| Red    | `#e62d42`    | `#c00023`  |
| Pink   | `#d56199`    | `#a2326c`  |
| Purple | `#9141ac`    | `#8939a4`  |
| Slate  | `#6f8396`    | `#526678`  |

The fill column preserves the official Adwaita accent backgrounds except for
yellow, which is minimally darkened to clear 3:1 across the canvas gradient.
The theme uses Adwaita's light standalone colors for text where they meet its
stronger 5.68:1 floor on the intended near-white and white surfaces. Teal and
green are minimally darkened for that floor. The wash role derives a
low-opacity canvas treatment from the selected fill.

The selected accent controls canvas depth, cover and section accents,
ordinary-slide title treatment, footer rule, links, list markers, focus
indicators, technical-content borders, and informational callouts. Success,
warning, danger, syntax-highlighting, terminal-prompt, ordinary-text, and
neutral-surface colors remain fixed so presentation identity cannot change
their meaning.

#### Runtime application through `global-top.vue`

`global-top.vue` is the one deck-wide bridge from reactive Slidev
`themeConfig` to CSS. It resolves `it230Accent`, writes the three accent tokens
to the document root, and records the name in `data-it230-accent`. An invalid
value produces a blocking `role="alert"` while blue keeps the underlying view
stable; review and build commands still reject the deck. Authors never add this
runtime component to slide content.

### Typography

The sans-serif stack prefers Lato, then Segoe UI, Noto Sans, and Liberation
Sans. The monospace stack prefers Cascadia Code, then JetBrains Mono, Noto Sans
Mono, and DejaVu Sans Mono. Both stacks use local system fonts and require no
font CDN or network request. The theme remains deterministic and legible
without downloading fonts. It disables font ligatures and contextual
alternates globally so adjacent source characters remain visibly distinct
throughout slides and match selectable text.

Slidev's optional image-preload pass is disabled by the theme. Images in
imported topic fragments are still processed, bundled, and displayed normally;
disabling the separate preload pass prevents it from generating unresolved
fragment-relative URLs in production output.

Inline code, fenced code, terminal transcripts, and semantic text using a
color-text component's `code` prop use `--it230-font-weight-code` at weight
`600`. This selects a real semibold face when the installed monospace font
provides one and gives projected technical text more presence than the normal
weight without making every token bold.

Headings use strong weight, compact line height, and readable wrapping.
Technical text uses a classroom-readable monospace size and line height. Do not
reduce type merely to fit overcrowded content; simplify or split the slide.

### Spacing and shape

Theme spacing follows named steps from `--it230-space-1` through
`--it230-space-7`. Shared surfaces use the small, medium, or large radius tokens
and one restrained raised-surface shadow. The rounded geometry follows
Adwaita's visual character, while type, spacing, and control proportions remain
large enough for Zoom screen sharing rather than copying desktop-interface
dimensions.
Reuse the tokens instead of adding nearly equivalent one-off values to shared
theme code.

Ordinary block elements and shared components use these tokens for consistent
spacing. Do not add `<br />` merely to create a gap; use the layout controls or
fix a recurring gap in the shared theme.

## Ordinary Markdown and technical content

The default Slidev layout receives the theme's canvas, typography, spacing,
heading, link, list, table, blockquote, inline-code, fenced-code, and focus
styles. Fenced code uses a light surface and the theme's high-contrast Shiki
palette. Its blue functions, teal strings and types, violet constants, purple
keywords, red errors, and muted comments adapt GtkSourceView's Adwaita syntax
roles to the theme's stronger contrast floor. Links remain underlined, list
markers retain visible shape, and semantic meaning must survive without color.

Inline code renders as accent-colored monospace text with no background or
border, in prose, in a heading, or alone on a line. A bordered chip reads as
heavy, boxy chrome, so color and the monospace face are the only emphasis.

An ordinary slide title is followed by a subtle tapered accent. Slides other
than `cover` and `section` receive a compact footer with the course identity and
current slide number, separated from the content by a rounded rule that moves
from the neutral line color toward the selected accent. The rule is decorative
and hidden from assistive technology. The title accent and footer provide
continuity and orientation without competing with instructional content or
resembling application chrome. On the final state of any non-empty click
sequence, the footer displays `NEXT →` immediately before the slide number.

Use ordinary fenced code for source and short commands. Use `TerminalWindow`
when a terminal frame clarifies that the content is an interactive session or
captured command output. Use a `bash-session` fence inside `TerminalWindow`
when the transcript includes Bash prompts, commands, and output.

Images receive `min-width: 0` so they can shrink inside grid and flex tracks.
The `default` and `two-cols-header` layouts additionally fit a lone Markdown
image within its available region while preserving its aspect ratio. Size
other images deliberately when they should be smaller than their container.

Every image also receives the theme's large corner radius and an opaque
background gradient from `--it230-color-accent-fill` in the bottom-left to
`--it230-color-accent-text` in the top-right. Opaque image pixels cover the
background completely; transparent and partially transparent pixels reveal
the selected deck accent. Authors do not add a wrapper, class, or slide-scoped
style for this treatment.

## Layouts

### `cover`

Use for the first slide of a deck. The default slot holds the title and
subtitle. The optional `kicker` slot replaces the course identifier above the
title.

### `section`

Use at a meaningful instructional boundary. The default slot holds a concise
section title and orientation sentence. The optional `kicker` slot supplies a
section number or short context label.

### `center`

Use for a short statement or compact composition that should be centered as one
unit both vertically and horizontally. The layout also centers text. Do not use
it to rescue an overcrowded slide.

### `default`

The local default layout needs no `layout` declaration. Its first top-level
element is one `h1`; each later top-level element is one body item.

| Prop          | Values                        | Default  | Effect                                    |
| ------------- | ----------------------------- | -------- | ----------------------------------------- |
| `vertical`    | `start`, `center`, `evenly`   | `evenly` | Positions body items below the fixed title |
| `horizontal`  | `start`, `center`, `end`      | `start`  | Aligns body blocks, not their inner text   |
| `listSpacing` | `normal`, `padded`             | `normal` | Adds space to top-level list items only    |

Flexible spacing collapses before content when height is constrained. A lone
Markdown image fits the available body region without changing its aspect
ratio. Split an overcrowded slide instead of reducing type.

```md
---
vertical: center
listSpacing: padded
---

# Before changing a service

- Inspect its current state
- Identify the desired state
- Make one change
- Verify the result
```

### `two-cols-header`

Use when two related ideas need to be compared beneath one full-width title or
shared introduction. The default, `left`, and `right` slots stay in that source
order. `vertical`, `horizontal`, and `listSpacing` have the same values and
defaults as the default layout but apply independently within each column.
`leftWidth` accepts a number greater than 0 and less than 100, defaults to `50`,
and determines the remaining right-column share.

A lone Markdown image fits its column while preserving its aspect ratio, so a
specialized image layout is unnecessary. Place it in source order, set
`leftWidth` only when unequal tracks help the content, and provide an
appropriate text alternative.

Ordinary content slides use the theme's override of Slidev's default layout.
Do not add a `layout` declaration for them, and do not use `cover` or `section`
merely to create visual variety.

Layouts do not add title bars, window controls, or other application chrome.
Ordinary slides must not pretend to be desktop applications.

## Components

### `SequenceEndCue`

This internal footer component displays `NEXT →` at the final state of a
non-empty click sequence without shifting slide content. It appears in main and
presenter rendering, not overview or next-slide preview. Authors never add it;
the footer owns the instance, and layouts that hide the footer hide the cue.

### `CommandExplainer`

`CommandExplainer` reveals parts of one selectable prompt or command without
moving the text. `command` supplies the base string; each ordered `steps` entry
supplies `active`, `explanation`, and optionally a replacement `command` or
one-based `occurrence` for repeated text.

```md
<CommandExplainer
  command="student@workstation:/etc$ ls -l"
  :steps="[
    { active: 'student', explanation: 'The logged-in user' },
    { active: 'workstation', explanation: 'The current host' },
    { active: '/etc', explanation: 'The working directory' },
  ]"
/>
```

An active substring must resolve unambiguously; invalid, missing, overlapping,
or ambiguous matches produce an authoring error. The low-level `segments` plus
`explanation` form handles one unusual explicit state and requires exactly one
active segment.

The component owns the slide's click progression. Use it for short command,
prompt, or path anatomy, not multiline procedures or output. Keep a complete
reference nearby when several parts are introduced.

### `TerminalWindow`

`TerminalWindow` frames selectable terminal input and output on a light surface.
Its neutral desktop-terminal chrome uses one centered title bar with decorative
window controls and no tab strip. Its optional `title` prop labels the terminal
region and defaults to `Terminal`. Terminal transcripts omit Slidev's copy
control because the transcript can contain output that is not valid command
input. Ordinary command-only fences retain the copy control.

`bash-session` recognizes a prompt only when a line begins with a complete
`user@host:directory$` or `user@host:directory#` prompt. A command may follow
after optional whitespace, and a bare prompt is valid. User prompts use green,
privileged prompts use danger red, commands use the Bash grammar, and unmatched
output uses the normal foreground. Literal prompt text preserves user,
location, and privilege meaning without color.

`TerminalWindow` accepts either a fixed `bash-session` fence or a `md
magic-move` sequence. See "Terminal transcripts" in
`docs/course-authoring.md` for the authoring rule. On a sequence's final state,
the footer cue indicates that the next click advances to another slide. Line
numbers count every physical transcript line, including output and blank lines.

Application chrome is appropriate here because the component depicts a real
terminal interaction. A future browser frame may use the same exception when a
concrete web-server lesson needs to show a rendered page. Do not add a generic
browser component before that instructional need establishes its content and
interface.

### `Callout`

`Callout` highlights a short supporting statement. Its `type` prop accepts
`accent` (the default), `success`, `warning`, or `danger` — the same four
names as the color-text components below — and each renders a visible label
and symbol in addition to color, so meaning survives without color. Its
optional `title` prop replaces the default label.

```md
<Callout type="warning">
Confirm the unit name before enabling it at boot.
</Callout>
```

Do not stack many callouts as the main structure of a slide. Use ordinary
headings and lists when information is not genuinely supplemental.

### `AccentText`, `SuccessText`, `DangerText`, `WarningText`, `InfoText`

Five plain `<span>` components apply semantic color and bold weight with no
background. `AccentText`, `SuccessText`, `WarningText`, and `DangerText` match
the four `Callout` types. `InfoText` is an informational alias for the accent
color because the palette has no separate info hue.

Each also accepts three boolean props: `normal` explicitly uses normal font
weight for a one-off span, `italic` adds italic emphasis, and `code` selects the
monospace face with no chip, matching inline code elsewhere. Combine as needed.

```md
# Effortful practice is required <DangerText>to pass the RHCSA exam</DangerText>

- <AccentText normal>This one-off span uses normal weight.</AccentText>
- Run <DangerText code>rm -rf /</DangerText> and there's no undo.
```

Use these to color a run of prose or part of a heading. Color alone is not an
accessible way to convey meaning — pair it with wording that already says
what's being emphasized, the way `Do not <DangerText>...</DangerText>`
reads correctly even without color. Do not use these as a substitute for
`Callout`, which pairs its color with a label and symbol specifically because
a supplemental note needs to survive without color.

## Adding shared patterns

Solve a new instructional need in course content first. Promote it into the
theme only when it has a clear reusable purpose, a small content-agnostic
interface, and either an existing second use or an identified near-term one.
Keep one-off or changing treatments with their course content.

When a shared pattern is justified:

1. Name it for its presentation responsibility, not its originating week or
   Linux topic.
2. Add the smallest supported interface.
3. Add a focused gallery example.
4. Document when it should and should not be used.
5. Build the gallery and all published decks before publication.

## Gallery and validation

The focused gallery is `packages/slidev-theme-it230/example.md`. It covers every
layout and component the theme supports, ordinary Markdown, fenced code,
terminal output, and the visual foundations.

The root theme review commands and their artifacts are documented in
`docs/publishing.md`. `pnpm check` verifies formatting, the toolchain, palette
and contrast tests, the default accent build, and the production gallery build.
Building and testing all nine accents is available via
`pnpm run test:theme:all`. The deck validator rejects unsupported accents.
Automated checks do not replace browser and Zoom review at the intended
1920x1080 viewport.

When a theme contract changes, update the gallery and this document in the
same reviewed change. Check every published deck for regressions once real
course decks exist.
