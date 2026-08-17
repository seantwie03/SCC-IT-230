# Course Authoring

## Canonical content

Organize instructional material by chapter or topic under `course/chapters/`.
A topic directory owns its source fragments, ordinary assets, demonstrations,
and exercises. Weekly files such as `course/w01.md` are concise composition
documents that import canonical topic fragments in teaching order.

Use stable, descriptive, lowercase kebab-case names. Curriculum-aligned topic
directories may begin with `rh124-` or `rh134-` when they align with Red Hat
Academy course material; original course topics may begin with `it230-`.
These names express subject alignment and do not indicate ownership of
third-party curriculum material.

## Instructional model

Course material follows "I Do, We Do, You Do": the instructor presents slides
(I Do), leads the class through in-class exercises (We Do), then students
complete a lab assignment independently after class (You Do).
Focus a demonstration or exercise on the core workflow — the "formula" — and
vary only the parameters between the in-class exercise and the lab assignment
that follows it. Delay edge cases until the primary concept is solidly
understood; introduce them on a later slide or in a later week rather than
complicating the first pass.

Verify commands and output against RHEL 10.0, the version this course
targets.

## Presentation entries and publication

A presentation entry is a Markdown file beneath `course/`. Its first
headmatter block must select the local theme and static-site router. It should
usually supply an `it230Accent` and a title as shown in the example below:

```yaml
---
theme: it230
themeConfig:
  it230Accent: teal
routerMode: hash
title: IT-230 — Week 01
---
```

Use `pnpm dev -- course/<entry>.md` for focused authoring and
`pnpm run review -- course/<entry>.md` for agent review. These commands may
open an incomplete, unregistered deck without publishing it.

Add a deck to `slides.config.mjs` only after it is ready to be public. A
presentation registry entry contains exactly:

- `id`: `w01` through `w16`, or a durable lowercase topic ID beginning with
  `it230-`, `rh124-`, or `rh134-`. The site derives its stable `/<id>/` route
  from this value.
- `title` and `summary`: student-facing landing-page text.
- `entry`: the canonical repository-relative Markdown path beneath `course/`.
- `topics`: a non-empty list of concise student-facing topic labels.

Do not add a `published` flag, semester-specific route, migration status,
reviewer name, private source location, or private note. Registry membership
itself means the deck is publishable. Keep the accent in deck headmatter.

## Fragments

Give reusable fragments meaningful names based on the concept they teach, not
their position in a particular week. Reuse a canonical fragment instead of
copying slides. Keep a fragment focused enough that its title, notes, assets,
and expected teaching sequence remain understandable at its source location.

## Slide structure

Organize each major topic within a fragment as a **section**: a
`layout: section` title slide followed by focused content slides. Usually the
topic includes an exercise, place it at the end of that section. Name a
section for the concept it covers ("Physical Volumes"), not one procedure
("Creating a Physical Volume").

1. `layout: section` — topic title
2. An intro slide explaining what the concept is and why it matters
3. One slide per idea, command, or tightly related procedure
4. An exercise slide when the topic includes a "We Do" activity

Keep a slide focused on one concept or tightly related procedure. Use
`TerminalWindow` for terminal interaction, `CommandExplainer` for the anatomy
of a short command or prompt, and `Callout` for a genuinely supplemental
caveat. Use a click sequence only when progressive disclosure helps explain a
procedure; do not hide unrelated commands in one sequence.

Try to make the slides visually interesting by adding color, components, tables,
charts, images, etc. Pure text slides are very borring. Keep slides short, fewer
words is generally better.

### Choosing a layout

Use the theme contracts in `docs/design-system.md`:

- Omit `layout` for an ordinary titled slide. Use `vertical`, `horizontal`, and
  `listSpacing` only when their defaults do not express the content.
- Use HTML sparringly, prefer layout props. If similar HTML is needed across
  multiple slides, that is an indication that a component or prop is needed. prop.
- Use `center` for a short statement or compact composition that should be
  centered as one unit.
- Use `two-cols-header` for a comparison or text-and-image composition. Keep
  source order as shared context, left column, then right column; use
  `leftWidth` only when equal columns are not appropriate.

Prefer layout props and ordinary block structure to spacing-only `<br />`
elements or wrapper markup. Split content that remains crowded at the theme's
intended type size.

### Presenting commands and workflows

Present command workflows in slides with `TerminalWindow`, using progressive disclosure
when it helps students follow the sequence. When a workflow is too long, interactive, or
cumbersome to present clearly in `TerminalWindow`, make it an in-class type-along
exercise instead. See the 'Demonstrations and exercises' section for more details.

Use an ordinary `bash` fence when showing command examples or a sequence of commands that
are not part of a workflow. Use `TerminalWindow` when terminal context is itself
instructional or when demonstrating a series of commands in a workflow. Its transcript
uses `bash-session` and includes the complete prompt on each command line.

A `bash-session` command line begins with a literal `user@host:directory$` or
`user@host:directory#` prompt. Lines without that complete prompt are plain output.
Do not remove or rewrite valid `#` or `$` characters merely to affect highlighting.
The command region receives the theme's automatic Bash syntax highlighting. Do not
add manual color markup to either region.

### Simulate typing with magic-move

A fixed prompt, command, or transcript may use one `bash-session` fence. Use an
```` ```md magic-move ```` block when the instructor should reveal a terminal
session step by step. Each nested fence repeats the complete transcript so far
and adds the next visible state: an initial prompt when useful, a typed command,
then its output or the prompt returned by a command with no output. A final
state may stop after the relevant output when the next prompt is not part of
the lesson.

`````md
<TerminalWindow title="student@lab:~">

````md magic-move
```bash-session
student@lab:~$ systemctl is-active sshd
```
```bash-session
student@lab:~$ systemctl is-active sshd
active
student@lab:~$
```
````

</TerminalWindow>
`````

A bare prompt after a command means it completed and returned control without
displayed output. Do not use that state when the command's real output has only
been omitted; either show the output or stop at the typed command.

Magic Move supports both line highlighting and visible line numbers. Add a
click-based sequence such as `{1|2|4|5|all}` to a nested `bash-session` fence,
and enable visible line numbers with `{lines:true}` on the `magic-move` wrapper
or an individual nested fence. Highlight selectors count every physical line
in that transcript state, including prompts, output, and blank lines. The same
highlighting and line-number options also work on ordinary code fences outside
`TerminalWindow`.

### Exercise slides

Place exercise slides at the **end of the section it belongs to**, not at the end
of the whole presentation. It covers only what that section taught.

Each exercise has two slides. The first slide describes *what* to accomplish, not the
commands to copy; a verification step may name its tool when verification is not the
learning objective. An example is provided below:

```md
# Exercise: Title

## Requirements

Host: `servera`

## Steps

1. Vague step describes the goal, not the command
2. Vague step
3. Verify with `tool1` and `tool2`
```

This vagueness is what keeps a published exercise slide a learner-facing
activity rather than an answer key; see "Demonstrations and exercises" below
for the file-based counterpart under `exercises/`.

The second slide has the same title. It includes:

- A 'gif' of the exercise being performed. This gif is created from the Asciinema
  recording using the `agg` tool.
- A link to the Asciinema recording
- A link to the site page containing the long form written exercise.

See the 'Demonstrations and exercises' section for more details.

### Naming convention

Use generic stand-in names on ordinary slides (`vg01`, `lv01`) — like
variables in algebra. Give exercises distinct, meaningful names (`vg_data`,
`lv_data`) so students must think through the mapping rather than copy the
slide verbatim. Graded lab assignments follow the same meaningful-name
pattern.

## Demonstrations and exercises

Live command-line activities are always authored and stored as exercises.
Normally, the instructor performs the exercise with `kitty-demo.sh` while students
type along. When time is limited, the instructor may perform the exercise solo;
this delivery mode is called a demonstration. A demonstration is not a separate content
type: use the existing exercise file and do not create a demos/ directory or
demonstration-specific copy.

Store type-along exercises under the owning topic's `exercises/` directory.
The instructor performs each exercise with
[`kitty-demo.sh`](https://github.com/seantwie03/cli_demos) while students type
the same steps on their own VMs. This is the guided "We Do" phase of the
instructional model, not a separate demonstration.

Each exercise is a command file for `kitty-demo.sh`, which uses Kitty's remote
control to drive a two-window presentation: a Controller window for the
instructor and an audience-facing Presentation window. Within the file:

- `#^` marks a visible step header, shown to the audience.
- `#!` marks a delivery note, shown only in the Controller window. The note is
  still public repository source.
- Every other line — including a literal `#` comment — is typed into the
  Presentation window and executed live, including keystrokes for a TUI such
  as `vim`, `less`, or `fdisk`.

Every exercise file opens with the target host and a clear screen:

```sh
kitten @ set-font-size 30.0 && ssh {HOSTNAME}
clear
```

Write file edits as literal keystrokes — for example, `i`, the text to insert,
then `jj:wq` to exit insert mode and save, since lab hosts map `jj` to
<kbd>Esc</kbd>. An exercise must be self-contained because students follow it
on their own VMs in real time: include prerequisites, the expected environment,
required setup, safe execution guidance, verification, and cleanup when
needed. Target the SCC Lab, defaulting to `servera` and `workstation` unless the
topic explicitly needs more nodes. Nothing may depend on pre-staged student
machines.

Write a companion `html` file that mirrors the command file but convert the
keystrokes, `#^` and `#!` lines into prose that would make sense when read
as a student stepping through the exercise. This file is hosted on the site.
It's intended audience is students performing the exercise outside of class.

These exercises are public guided activities, not answer keys for graded work.
Do not publish assessment solutions, grading records, restricted material, or
student information.

## Assets

Keep ordinary assets with their topic. Every third-party asset needs a clear
publication basis and any required attribution at or near the asset.

Do not reproduce Red Hat Academy source material, guided exercises, labs,
quizzes, instructor-guide content, transcripts, or extracted media. References
to curriculum names are for alignment only.

Generate a exercise's screen-recording GIF from its `kitty-demo.sh`
Asciinema recording with
`agg --cols 120 --rows 24 --theme github-light --last-frame-duration 10 <cast-or-url> <output>.gif`,
keeping the recording visually consistent with the theme's light terminal surface.

Assets consumed only by a presentation stay with the owning topic and are
processed by Slidev. A standalone downloadable resource must be explicitly
listed in the registry with student-facing `title` and `summary`, a stable file
route beneath `/resources/`. The source must remain inside this repository.

## Accessibility

Read `docs/accessibility.md` before adding or substantially revising student-
facing course material. Author source so its meaning and sequence remain clear
without depending on visual position, color, or presenter narration alone.

- Use meaningful headings, lists, tables, and link text in a logical source and
  reading order.
- Give informative images useful text alternatives and explain complex visual
  material in text. Mark genuinely decorative images accordingly.
- Provide captions for prerecorded instructional video and an appropriate text
  alternative for instructional audio.
- Keep code and terminal examples as text whenever possible. If an image of
  technical content is necessary, provide the equivalent commands, output, or
  explanation as text.
- Keep essential instructions and distinctions in student-facing content; do
  not encode them only through color, spatial position, animation, or presenter
  notes.
- Review tables and custom components for a sensible reading order before
  publishing them.

Treat accessibility as part of authoring, not as an export-time repair.

## Deck accent

Choose a deck accent to have some variety throughout the course. Set it once
in the entry file's headmatter:

```yaml
themeConfig:
  it230Accent: purple
```

Supported values are `blue`, `teal`, `green`, `yellow`, `orange`, `red`,
`pink`, `purple`, and `slate`. Omit the setting to use blue. Do not provide an
arbitrary color, change the accent per slide, or use the accent as the only
way to distinguish instructional meaning.

Prefer the cool `blue`, `teal`, `green`, `purple`, or `slate` accents for
Bash-heavy presentations. They sit comfortably beside the fixed cool syntax
palette. Use `yellow`, `orange`, or `red` deliberately in decks with little
syntax because those warm identity colors can compete with syntax and status
colors.

The theme applies the selection to links, markers, focus, technical
content borders, informational callouts, and recurring deck framing. Syntax,
terminal prompts, success, warning, and danger colors intentionally remain
independent. Authors must continue to pair meaning with labels, symbols,
structure, or text.

## Presenter notes

Treat presenter notes as public source. Notes may contain delivery cues,
technical explanation, and anticipated questions, but no confidential
information or material that would be inappropriate for a student to read.
Production presentations omit notes from the published output.
