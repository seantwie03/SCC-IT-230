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
