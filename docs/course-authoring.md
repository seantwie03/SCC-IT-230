# Course Authoring

## Canonical content

Organize instructional material by chapter or topic under `course/chapters/`.
A topic directory owns its source fragments, ordinary assets, demonstrations,
and exercises. Weekly files such as `course/w01.md` are concise composition
documents that import canonical topic fragments in teaching order.

Use stable, descriptive, lowercase kebab-case names. Curriculum-aligned topic
directories may begin with `rh124-` or `rh134-`; original course topics may
begin with `it230-`. These names express subject alignment and do not indicate
ownership of third-party curriculum material.

## Presentation entries and publication

A presentation entry is a Markdown file beneath `course/`. Its first
headmatter block must select the local theme and static-site router:

```yaml
---
theme: it230
routerMode: hash
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

## Demonstrations and exercises

Store runnable demonstrations under the owning topic's `demos/` directory and
in-class activities under `exercises/`. Include prerequisites, expected
environment, safe execution instructions, and cleanup steps when needed.
Never embed credentials or internal-only endpoints.

Exercises published here are learner-facing activities. Do not publish answer
keys, grading records, restricted assessments, or student information.

## Assets

Keep ordinary assets with their topic. Every third-party asset needs a clear
publication basis and any required attribution at or near the asset.

Do not reproduce Red Hat Academy source material, guided exercises, labs,
quizzes, instructor-guide content, transcripts, or extracted media. References
to curriculum names are for alignment only.

Assets consumed only by a presentation stay with the owning topic and are
processed by Slidev. A standalone downloadable resource must be explicitly
listed in the registry with student-facing `title` and `summary`, a stable file
route beneath `/resources/`, and a `publicationBasis` explaining why it can be
published. The source must remain inside this repository. Do not list a
standard Slidev PDF as a resource; PDF publication requires a separate tagged-
document accessibility workflow.

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

## Terminal transcripts

Use an ordinary `bash` fence for example commands when their output is omitted.
If a slide displays command output, use `TerminalWindow`. Every
`TerminalWindow` transcript must use a `bash-session` fence and include the
complete prompt on each command line.

A `bash-session` command line begins with a literal `user@host:directory$` or
`user@host:directory#` prompt. Lines without that complete prompt are plain output.
Do not remove or rewrite valid `#` or `$` characters merely to affect highlighting.
The command region receives the theme's automatic Bash syntax highlighting. Do not
add manual color markup to either region.

Because `bash-session` remains an ordinary fenced language, it supports
Slidev's static and staged line-highlighting syntax. Line numbers count every
physical transcript line, including output and blank lines. Dimming
nonessential lines is an intentional focus treatment. Give each important line
a full-contrast stage, and include an `all` stage when students need to compare
the complete transcript.

## Presenter notes

Treat presenter notes as public source. Notes may contain delivery cues,
technical explanation, and anticipated questions, but no confidential
information or material that would be inappropriate for a student to read.
Production presentations omit notes from the published output.
