# Design System

## Purpose and responsibility

The local `slidev-theme-it230` package provides the shared visual language for
IT-230 presentations. It owns visual tokens, ordinary slide styling, reusable
layouts, reusable components, and the focused theme gallery. Course-specific
explanations, examples, and composition remain in course content.

The theme is light-first. A near-white canvas and dark text support the
instructor's visual preference and students who find sustained dark-theme
reading difficult. The minimum theme does not provide a dark counterpart.

The visual language is Adwaita-inspired. It translates Adwaita's semantic
light surfaces, named accent palette, typography, rounded geometry, and
restrained depth into presentation-scale choices. It is an original
presentation system, not an exact reproduction of a particular GNOME or RHEL
release and not an SCC or Red Hat brand treatment.

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

Slidev makes `themeConfig` available to Vue through its global slide context,
but CSS cannot read that headmatter directly, and importing the palette module
does not cause Slidev to invoke its resolver. The theme therefore uses
`packages/slidev-theme-it230/global-top.vue` as the runtime bridge between the
deck configuration and the visual tokens.

`global-top.vue` is a Slidev global layer with one instance for the complete
presentation. After mounting, it watches the reactive
`$slidev.themeConfigs.it230Accent` value, passes that value to the central
resolver, and writes the resulting fill, text, and wash custom properties to
the document root. Every layout and component can then consume the same deck
accent without receiving props or repeating configuration logic. The root
`data-it230-accent` attribute records the resolved name for inspection.

The single global instance is intentional. A per-slide layer such as
`slide-top.vue` would create duplicate watchers and could render the same
configuration error once for every slide. The top layer also provides an
appropriate host for the authoring error that must appear above slide content.

If resolution fails, the component marks the root accent state as invalid,
applies the default blue variables only to keep the underlying interface
stable, and teleports a blocking `role="alert"` message to the document body.
The fallback does not accept the invalid value: repository review and build
commands still reject it. Correcting the headmatter during local development
causes the watcher to remove the message and apply the valid accent without a
server restart. This file is runtime theme infrastructure; it does not contain
course content or a decorative element that authors add to individual slides.

### Typography

The sans-serif stack prefers Lato, then Segoe UI, Noto Sans, and Liberation
Sans. The monospace stack prefers Cascadia Code, then JetBrains Mono, Noto Sans
Mono, and DejaVu Sans Mono. Both stacks use local system fonts and require no
font CDN or network request. The theme remains deterministic and legible
without downloading fonts. It disables font ligatures and contextual
alternates globally so adjacent source characters remain visibly distinct
throughout slides and match selectable text.

Headings use strong weight, compact line height, and balanced wrapping.
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

## Ordinary Markdown and technical content

The default Slidev layout receives the theme's canvas, typography, spacing,
heading, link, list, table, blockquote, inline-code, fenced-code, and focus
styles. Fenced code uses a light surface and the theme's high-contrast Shiki
palette. Its blue functions, teal strings and types, violet constants, purple
keywords, red errors, and muted comments adapt GtkSourceView's Adwaita syntax
roles to the theme's stronger contrast floor. Links remain underlined, list
markers retain visible shape, and semantic meaning must survive without color.

An ordinary slide title is followed by a subtle tapered accent. Slides other
than `cover` and `section` receive a compact footer with the course identity and
current slide number, separated from the content by a rounded rule that moves
from the neutral line color toward the selected accent. The rule is decorative
and hidden from assistive technology. The title accent and footer provide
continuity and orientation without competing with instructional content or
resembling application chrome.

Use ordinary fenced code for source and short commands. Use `TerminalWindow`
when a terminal frame clarifies that the content is an interactive session or
captured command output. Use a `bash-session` fence inside `TerminalWindow`
when the transcript includes Bash prompts, commands, and output.

## Layouts

### `cover`

Use for the first slide of a deck. The default slot holds the title and
subtitle. The optional `kicker` slot replaces the course identifier above the
title.

### `section`

Use at a meaningful instructional boundary. The default slot holds a concise
section title and orientation sentence. The optional `kicker` slot supplies a
section number or short context label.

### `two-cols-header`

Use when two related ideas need to be compared beneath one full-width title or
shared introduction. The default slot holds the common header content. The
`left` and `right` slots hold equal-width columns with enough space between them
for code and terminal line-number gutters. Keep the source order as shared
context, left column, then right column so the reading sequence remains clear
without relying on visual position.

Ordinary content slides use Slidev's default layout with global theme styling.
Do not use `cover` or `section` merely to create visual variety.

Layouts do not add title bars, window controls, or other application chrome.
Ordinary slides must not pretend to be desktop applications.

## Components

### `TerminalWindow`

`TerminalWindow` frames selectable terminal input and output on a light surface.
Its neutral desktop-terminal chrome uses one centered title bar with decorative
window controls and no tab strip. Its optional `title` prop labels the terminal
region and defaults to `Terminal`. Terminal transcripts omit Slidev's copy
control because the transcript can contain output that is not valid command
input. Ordinary command-only fences retain the copy control.

````md
<TerminalWindow title="student@lab:~">

```bash-session {1|2|4|5|all}
student@lab:~$ cd /etc/ssh
student@lab:/etc/ssh$ printf '%s\n' '# [ ] $HOME'
# [ ] $HOME
student@lab:/etc/ssh$ sudo -i
root@lab:~# systemctl is-active sshd
active
```

</TerminalWindow>
````

`bash-session` recognizes a command only when a line begins with a complete
`user@host:directory$` or `user@host:directory#` prompt followed by whitespace.
It preserves the complete transcript as visible, selectable text. Following
the light Ptyxis terminal model, the user, host, `@`, and working directory use
an accessible terminal green for prompts ending in `$` and an accessible danger
red for privileged prompts ending in `#`. The `:` and final `$` or `#` symbol
use the normal foreground. The command region uses Shiki's Bash grammar and the
same Adwaita-derived syntax palette as an ordinary `bash` fence; unmatched
output stays in the normal terminal foreground. Valid `#`, and `$` characters
in commands and output do not change the prompt, command, or output boundaries.
The prompt's literal text communicates user, location, and privilege information
without relying on color alone.

Because `bash-session` remains an ordinary fenced language, it supports
Slidev's static and staged line-highlighting syntax. Line numbers count every
physical transcript line, including output and blank lines. Dimming
nonessential lines is an intentional focus treatment. Give each important line
a full-contrast stage, and include an `all` stage when students need to compare
the complete transcript.

The Bash-specific name leaves room for a separate `powershell-session`
language if course material later establishes that need.

Application chrome is appropriate here because the component depicts a real
terminal interaction. A future browser frame may use the same exception when a
concrete web-server lesson needs to show a rendered page. Do not add a generic
browser component before that instructional need establishes its content and
interface.

### `Callout`

`Callout` highlights a short supporting statement. Its `type` prop accepts
`note`, `tip`, `warning`, or `danger`; each type renders a visible label and
symbol in addition to color. Its optional `title` prop replaces the default
label.

```md
<Callout type="warning">
Confirm the unit name before enabling it at boot.
</Callout>
```

Do not stack many callouts as the main structure of a slide. Use ordinary
headings and lists when information is not genuinely supplemental.

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

Use the root commands:

```sh
pnpm run dev:theme
pnpm run review:theme
pnpm run build:theme
pnpm run capture:theme
pnpm run export:theme
```

`pnpm check` verifies formatting, the supported toolchain, palette and contrast
tests, all nine focused accent builds, and the production gallery build. The
deck validator rejects an unsupported `themeConfig.it230Accent` before a
reviewed build can be published. `pnpm run review:theme` serves the gallery only on a loopback
address for browser-first inspection at the 1920x1080 desktop viewport used
for Zoom screen sharing. Maintainer-run theme development uses fixed port 2020,
and agent-run theme review uses fixed port 2121. An occupied port causes the
corresponding command to fail rather than silently selecting another port.
`pnpm run capture:theme` exports the complete gallery directly to PNG; pass
one validated range such as
`pnpm run capture:theme -- 1,4-7` when only selected slides need deterministic
batch review. The optional PDF export is reserved for PDF-specific visual
regressions, and its untagged output is not an accessible student deliverable.
Generated theme-review output belongs under the theme package `dist/` and is
not committed.

When a theme contract changes, update the gallery and this document in the
same reviewed change. Check every published deck for regressions once real
course decks exist.
