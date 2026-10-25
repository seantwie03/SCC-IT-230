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
- `~/s/IT-230/wNN/slides/*.odp`, when present, are last year's decks as they
  were taught. They are usually more polished than the `.md` and often carry
  concept slides it lacks. Read both, and say in the plan how they combine.
- `~/s/IT-230/wNN/demonstrations/<topic>/*.sh` are the `kitty-demo` command
  files, most of which have no slide in the source deck.

When a slide needs a fact the decks do not settle, such as a limit, a default,
or a behavior, look first in the course's own references: the Cert Guide in
`~/s/IT-230/cert_guide_rhcsa_10/chNN-*.md` and the Red Hat Academy extracts in
`~/s/IT-230/wNN/rh134-chNN-*/` (also `rh124`). The fact may sit in a later
week's chapter. Search docs.redhat.com only for what those do not cover, and
name each fact's source in the plan.

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

A fragment with an exercise slide is not built until the exercise is: write its
command file and written HTML version (Step 4) alongside the fragment's slides,
verify them on the lab, and declare the exercise in the fragment's `topicInfo`
before showing the fragment. Only the recording waits for the end.

Before building the next fragment, re-read the instructor's edits to the one
just built and check the next fragment's plan against them. A renamed term, a
dropped slide, or a changed transcript often reaches forward. Propose the plan
changes, then build. When the instructor asks for suggestions, suggest; do not
edit.

### Images

Copy every source image in as `assets/<name>.placeholder.<ext>` when its
fragment is built. The repository's `*.placeholder.*` ignore rule keeps these
files out of commits, and laying out around the real image means the slide is
already sized when the replacement arrives. Replacing them is a separate pass,
image by image with the instructor, before the recordings.

Classify each image in the plan's Third-party images section:

- **Rebuild:** Red Hat figures and Cert Guide scans become our own tables or
  Mermaid diagrams from the start, never placeholders.
- **Replace:** an image with no recorded source. Replacements come, in order,
  from the instructor's own screenshots or AI images (theirs, so no credit
  line), Wikimedia Commons under CC BY or CC BY-SA, or nothing. Give the
  instructor links to look at before choosing. A Commons image takes a
  `text-xs` credit line under it: "Photograph by [Name](user page), cropped,
  [CC BY-SA 4.0](license), via [Wikimedia Commons](file page)".
- **Decorative:** an image that only gives the eye somewhere to rest. It takes
  empty alt text, `![](./assets/name.webp)`.

Never paint over or retouch a logo inside a screenshot. Crop only what the plan
says, and leave the rest of the capture as taken.

The instructor generates AI images with Gemini from a prompt you write:

1. Measure the box the image will fill, in slide units: in the review browser,
   divide the column's size by the page's width over 980. Pick the nearest
   aspect Gemini offers: 1:1, 3:4, 4:3, 9:16, or 16:9. For an image that fills
   the column's height, leave nothing under the title.
2. Ask for a solid chroma-key green background (#00FF00) that fills the image,
   the subject centered with empty green around every edge, and no shadows,
   floor, reflections, text, or logos. Rule out anything green or see-through
   in the subject, since the key would cut holes in it: name the subject's
   colors, and ask for opaque parts where real ones are clear plastic.
3. For a pair shown side by side, repeat the description word for word in both
   prompts, and have the second sent in the same Gemini chat, opening with
   "Same ... as the previous image."
4. Copy the download into its own new scratch directory and key it:

   ```sh
   python3 -I .agents/skills/week-porting/scripts/key-green.py \
       --canvas 900x1200 --preview 3584e4 <scratch-out> name=<download>
   ```

   Pass every image of a pair in one run so both get the same canvas and
   subject height. The script reports any part of the subject the key ate and
   any enclosed hole; look at the preview's edges, then at the slide. Save the
   result as WebP in the topic's `assets/`. The theme draws the week's accent
   behind images, so the transparency shows the accent.

Gemini sometimes returns another aspect than the one asked for; key it anyway
and choose `--canvas` for the box. Record in the plan who made each image, how,
and its final size. Before publication, no `*.placeholder.*` file or reference
may remain in the week.

## Step 3: verify everything against the lab

Every command, transcript, exit code, and error string gets run on the lab
before it lands in a slide or an exercise. Follow the `lab-verification` skill.
Reproducing plausible output is a correctness failure, not a style problem:
ported material frequently predates RHEL 10.

- Reach the lab only through `pnpm lab`.
- Restore any host you change, in the same session, and say so in the plan's
  Verification section. Removing a package, closing a port, deleting a file, and
  reverting a config edit are part of the work, not follow-up.
- The week's exercise chain (Step 4) is the exception. Once an exercise is
  verified, leave its host in the state that exercise ends in, so the next
  exercise is verified by running it on that state rather than on a rebuilt
  copy. Record in the plan's Verification section which exercise the lab is
  at. A side test, such as capturing a slide transcript or trying an edge
  case, still puts the host back where it found it: to the chain's state,
  not to the snapshot. The last exercise's cleanup returns the lab to the
  week's start.
- Record what you verified in the plan, including the answers that contradicted
  the source deck. The slides carry no presenter notes, so the plan is the only
  place that knowledge survives.

## Step 4: exercises

Each exercise is two files in the topic's `exercises/` directory, sharing one
`<name>-exercise` stem: a `.sh` command file for `kitty-demo.py` and an `.html`
written version for students working alone. The processed cast lands beside
them as `.cast`. `docs/course-authoring.md` holds the directive syntax,
the pause guidance, and the recording order. Write both files while building
the exercise's fragment, not afterward (Step 2). Write the command file first,
verifying each command on the lab as you write it.

Chain a week's exercises through the lab state. Each names its prerequisite
exercise, ends in the state the next one expects, and the last one's cleanup
returns the lab to where the week started: disks blank and configuration files
back to their original lines. Recording is then one live pass in order and one
recording pass in order, with no resets between. Capture slide transcripts
from the same chain, so device names and UUIDs agree from slide to slide.

The instructor runs `start-latest-snapshot -a` between weeks, so a week's
material can assume the lab starts from the snapshot, not from where the
previous week's exercises left it. The script is never used in student-facing
material, so the last exercise's cleanup is still written with commands the
week teaches; the `lab-verification` skill covers the script itself.

An exercise that only works in the SCC lab, such as installing a virtual
machine in VirtualBox, has a written version and no command file or recording.
Ask the instructor early for a dry run on the VDI with screenshots. A dry run
finds what the instructor lab cannot, such as settings that freeze the VDI or
steps too slow to wait for in class, and those can change the slide order.

Exercise slides come at the end of the section they belong to. The recording
slide is a second `exercise` slide with `variant: recording`, and it cannot be
built until the cast exists, so leave it out of the fragment and note it as
pending in the plan.

## Step 5: recordings, then publication

Recordings come last, after every slide, exercise, and image is settled.
Changing a command file invalidates its recording.

Before the instructor records, confirm through `pnpm lab`, read-only, that the
lab is at the week's starting state, and run `kitty-demo --check` on every
command file. Then give the commands in recording order with an estimated
length for each: the press count times 3 seconds, plus the `#@ pause` holds.
The installed command is `kitty-demo`, a link to `kitty-demo.py`. "Recording an
exercise" in `docs/course-authoring.md` has the live-run and record steps. If a
take fails partway, offer to put the lab back in that exercise's starting
state.

Process each cast with `pnpm run casts -- <path>`, one cast per run, and confirm
it with `pnpm run casts -- --check <path>`. Add each recording slide right
after its exercise slide, as "Exercise slides" in `docs/course-authoring.md`
shows: the `?url` import, a player `label` that describes the recorded
workflow, and the written exercise in `resources`. Open one in the review
browser to see the player load, and record each cast's length and marker count
in the plan.

### Publication

Publication is renaming `course/wNN-draft.md` to `course/wNN.md`. The existence
of that canonical file is the publication approval, so nothing else flags it.
In order:

1. Confirm no `*.placeholder.*` file or reference remains in the week.
2. Read `wNN-porting.md` as public material, since the porting plans are
   committed. Remove internal network addresses, anything else the course does
   not need, and any credential that `docs/lab-environments.md` does not
   already publish.
3. Rename with plain `mv`. The draft is untracked, and `git mv` would stage it.
4. Add `"wNN"` to the published-week list in `tests/site.test.mjs`.
5. Run `pnpm check` in the background and read its log. One "Course-site reload
   failed" error comes from a test that makes an invalid edit on purpose.
6. Hand the instructor the unstaged change list, the manual accessibility
   review, and the post-deploy checks in `docs/publishing.md`.

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

Overflow is the only bar. A slide with no room to spare is fine, so never trim
content for headroom. The `--verbose` clearance tells you how much a slide can
still take; it is not a target.

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

Slidev's development server syncs navigation between clients, so a page can
jump back to where an earlier session left off. Check `location.hash` before
taking a screenshot. The browser tool saves screenshots only under
`/tmp/it230-playwright-mcp/` or the repository; use the first.

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
  them. Never `pkill` by pattern. Start a review server with
  `nohup pnpm run review -- <entry> &` and save `$!`: that is pnpm, the leader
  of the process group the server runs in, so `kill -- -<pid>` stops all of
  it. Do not wrap it in `setsid`, which forks and leaves you holding the wrong
  PID.
- Files can change under you. Before editing a file you read a while ago, look
  at it again; the instructor edits the same fragments you are building.

## What the instructor does, not you

- All staging, committing, and pushing. Leave the work unstaged for review.
- Every decision listed in the plan, including cuts, image replacements, and
  accents.
- The final judgement on whether a slide reads well in the room.
