---
name: week-porting
description: Port one week of the instructor's source slides into this repository, from the plan through fragments, exercises, recordings, and publication. Use when asked to port, draft, or build a course week such as w08 through w16.
---

# Porting a Course Week

A port turns one week of the instructor's private source deck into canonical
topic fragments, exercises, and a weekly entry file in this repository. It is
not a rewrite. The source deck decides what is taught and in what order; this
repository decides how it is presented, and verifies that every command still
behaves the way the slide claims.

Read `docs/course-authoring.md` before writing any slide, and the other
documents named in the `AGENTS.md` table when the work reaches their area.

## The source

The instructor's private repository is a read-only reference:

- `~/s/IT-230/wNN/slides/*.md` is the source deck, usually one file.
- `~/s/IT-230/wNN/demonstrations/<topic>/*.sh` are the `kitty-demo` command
  files, most of which have no slide in the source deck.

Use only material approved for public release, and follow that repository's own
root guidance. Never copy Red Hat Academy guided exercises, labs, or instructor
guides into this repository.

## Step 1: write the plan, and stop

Create `wNN-porting.md` at the repository root and get it approved before
building anything. The plan is where disagreements are cheap.

- Open with **Answer in brief**: fragment count, exercise count, total slides,
  and a table of fragments with their section titles and slide counts.
- Give every slide its own level 5 heading, numbered by source order. A slide
  this repository adds carries a letter, such as `1.5a`, so the numbering of
  slides that come from the source never moves when something is inserted.
- Under each slide, name the source slide, what it teaches, and which layout
  and components it will use.
- Keep tables narrow. The instructor's editor does not wrap long cells, so a
  table with a paragraph in a cell is unreadable in review. Use prose instead.
- Carry these sections as well: Scope, Port fidelity, Source-to-fragment map,
  File inventory, Exercises, Additions, Corrections, Not ported, Verification,
  Authoring notes, Decisions, Open questions.
- Number each decision so the instructor can accept or reject them one by one,
  and record accepted ones with their date.

**Propose, do not decide.** Splitting a source slide, dropping one, replacing an
image, or adding a slide are all instructor calls. Put the proposal in the plan
with its reasoning and wait.

Keep the plan current as the build proceeds. When a fragment is built, rewrite
its entries to describe what shipped rather than what was planned, and mark the
heading `built YYYY-MM-DD`.

## Step 2: build fragment by fragment

One fragment is one topic file under
`course/chapters/<chapter-dir>/<topic>.md`, opening with its `layout: section`
slide. That first slide carries `routeAlias` and `topicInfo` with the curriculum
alignments and any exercises. Never put that frontmatter on the weekly `src`
import block.

The weekly entry file is `course/wNN-draft.md`: cover with the agenda, the VM
reminder slide, then one `src:` import per fragment in teaching order.

Build one fragment, show it, and take feedback before starting the next. A
fragment built on a misunderstanding is cheaper to fix alone than five are.

## Step 3: verify everything against the lab

Every command, transcript, exit code, and error string gets run on the lab
before it lands in a slide or an exercise. Follow the `lab-verification` skill.
Reproducing plausible output is a correctness failure, not a style problem:
ported material frequently predates RHEL 10.

- Reach the lab only through `pnpm lab`.
- Restore any host you change, in the same session, and say so in the plan's
  Verification section. Removing a package, closing a port, deleting a file, and
  reverting a config edit are part of the work, not follow-up.
- Record what you verified in the plan, including the answers that contradicted
  the source deck. The slides carry no presenter notes, so the plan is the only
  place that knowledge survives.

## Step 4: exercises

Each exercise is two files in the topic's `exercises/` directory, sharing one
`<name>-exercise` stem: a `.sh` command file for `kitty-demo.py` and an `.html`
written version for students working alone. The processed cast lands beside
them as `.cast`. `docs/course-authoring.md` holds the directive syntax,
the pause guidance, and the recording order. Write the command file first,
verifying each command on the lab as you write it.

Exercise slides come at the end of the section they belong to. The recording
slide is a second `exercise` slide with `variant: recording`, and it cannot be
built until the cast exists, so leave it out of the fragment and note it as
pending in the plan.

## Step 5: recordings, then publication

Recordings come last, after every slide and exercise is settled: record with
`kitty-demo.py --record`, process with `pnpm run casts`, then add the recording
slides. Changing a command file invalidates its recording.

Publication is renaming `course/wNN-draft.md` to `course/wNN.md`. The existence
of that canonical file is the publication approval, so nothing else flags it.

## Checks

While authoring one week, prefer the focused commands, which all accept a single
entry including a draft:

```sh
pnpm run check:entry -- course/wNN-draft.md
pnpm run check:slides -- course/wNN-draft.md --verbose
pnpm run check:exercises -- course/wNN-draft.md
```

Run `pnpm check` before publication. It is the full suite, needs a browser, and
takes longer.

`check:slides` fails on content that leaves the slide and on console errors. It
does not judge how full a slide looks, and it cannot see overflow inside a
fenced code block, which scrolls in its own container. So capture every slide
that carries a fence in the browser at 1920x1080 and look at it. Two overflows
in w07 were invisible to the checker and obvious in a screenshot.

### Looking at a slide

Serve the draft for review and capture it with the browser tool:

```sh
pnpm run review -- course/wNN-draft.md   # deck on 3131
pnpm run review:theme                    # theme gallery on 2121
```

The browser tool is allowed to reach `localhost:3131` and `localhost:2121` and
nothing else, so review through those commands rather than a server of your own.
A deck that sets `routerMode: hash` is addressed as `http://localhost:3131/#/32`;
the gallery uses plain paths such as `http://localhost:2121/14`, and a click
state is `?clicks=N`. Resize to 1920x1080 first, since that is the presentation
viewport the theme is designed for.

## Fitting the class period

The class is 2.5 hours and has been running out of time. Prefer the shortest
path that teaches the objective:

- Teach the happy path. Edge cases that need a paragraph of explanation are
  usually deeper than RHCSA needs.
- When a demonstration's recovery steps take longer than the lesson, cut the
  demonstration rather than the lesson.
- Propose cuts explicitly in the plan, with what is lost.

## Component pitfalls that cost a rebuild

`docs/design-system.md` is authoritative. These are the ones that bite ports:

- `TerminalWindow` `rows` reserves that many rendered lines, so it belongs on a
  Magic Move transcript that grows and takes the final state's line count.
  Omit it on a fixed transcript.
- A line that starts with `AccentText` or a sibling loses its paragraph, so
  trailing prose becomes a separate body item. Keep such a component on its own
  line, or start the line with text.
- `TextExplainer` picks its size from the content. Forcing `size="lg"` on a line
  longer than about 44 characters runs it off the slide; drop the prompt or let
  the size be chosen.
- Mermaid diagrams drawn with Carbon icon shapes load their icons asynchronously,
  so heights vary slightly between runs. Leave headroom rather than tuning
  `scale` to the last pixel.
- `two-cols-header` has an optional `::bottom::` band for a closing line that
  belongs to both columns, and `horizontal` moves everything except the leading
  heading.

## Working in a shared clone

Other agents and the instructor work in this clone and in sibling clones at the
same time.

- Reserved ports: 3030 maintainer development, 3131 agent review, 2121 theme
  review, 3232 the slide checker. An occupied port is somebody else's work.
  Wait for it or ask; never take it.
- Stop only processes you started, by the PID you captured when you started
  them. Never `pkill` by pattern.
- Files can change under you. Before editing a file you read a while ago, look
  at it again; the instructor edits the same fragments you are building.

## What the instructor does, not you

- All staging, committing, and pushing. Leave the work unstaged for review.
- Every decision listed in the plan, including cuts, image replacements, and
  accents.
- The final judgement on whether a slide reads well in the room.
