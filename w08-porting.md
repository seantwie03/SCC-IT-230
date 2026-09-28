# W08 - Midterm Week

## Prompt

Week 8 is the Midterm exam. Publish `~/s/IT-230/exams/Midterm-StudyGuide.md`
as an HTML page without changing the build system (Option 1 from the
brainstorm: a short deck whose one topic declares the study guide as its
resource). The deck carries the exam-related slides from
`it230-course-introduction`, duplicated and made midterm-specific, a short
`history -c` / `history -w` explanation, and a slide linking to the study
guide with this prose:

> The link below takes you to a Study Guide for the Midterm. If you want to do
> well on the Midterm, I recommend you go work through this Study Guide. Write
> all the steps for each item in your notes. Then you will be able to use those
> notes on the Midterm.

## Answer in brief

Built 2026-09-28 and published the same day as `course/w08.md`. **One topic
fragment** in a new chapter directory, **one study guide page** (published
through the exercise pipeline), and a deck of **7 slides**. No build, theme,
or validation code changes.

| # | Fragment          | Section title | Slides | Resources |
|--:|-------------------|---------------|-------:|----------:|
| 1 | `midterm-exam.md` | Midterm Exam  |      5 |         1 |
|   | Entry file        |               |      2 |           |
|   | **Total**         |               |  **7** |     **1** |

## Scope

- `course/w08-draft.md`, renamed to `course/w08.md` at publication.
- `course/chapters/it230-exams/midterm-exam.md`, the one topic fragment.
- `course/chapters/it230-exams/exercises/midterm-study-guide-exercise.html`,
  the study guide, declared in the fragment's `topicInfo.exercises`.

There is no source deck for week 8. `~/s/IT-230/w08/` holds only a lesson plan.
The slide sources are `course/chapters/it230-course-introduction/course-overview.md`
(already public) and the introduction of the study guide itself.

The week page will read: Meeting Agenda with one topic, "Midterm Exam", and
one link beneath it, "IT-230 - Midterm Study Guide". "Open presentation",
"Download Slides (PDF)", and the fixed "Lab Assignments" block also appear.
The Lab Assignments text stays: the study guide is the only lab in the Canvas
module that week. With no curriculum alignments there is no "Before class" or
"RHCSA Cert Guide" section.

## Port fidelity

Slides adapted from `course-overview.md` keep that slide's layout, components,
and wording, changing only what makes them midterm-specific. Each change is
listed under its slide. Slides are numbered by their planned position; entry
slides are E1 and E2. Slide 4 was folded into slide 2 (Decision 6) and the
instructor removed slides 3 and 7, so the deck renders as E1, E2, 1, 2, 5, 6,
7a, which is slides 1 to 7 in the browser.

The study guide is converted one for one: every paragraph, task, and sub-item
of the Markdown appears in the HTML in the same order and wording, except the
changes listed under Corrections.

## Source-to-fragment map

- `course-overview.md` "IT-230 Exams" became slide 2.
- `course-overview.md` "Grades" became slide 3, since removed.
- `course-overview.md` "AI Guidelines" folded into slide 2's danger callout.
- Study guide introduction, screenshot paragraph, became slide 5.
- Study guide introduction, history paragraphs, became slide 6.
- Instructor prose became slide 7, replaced by slide 7a.
- The whole study guide became the HTML page.

Not carried from `course-overview.md`: the RHCSA certification exam slide,
the "Effortful practice" pair, and "Late Policy". They are about the
certification or the course generally, not the Midterm.

## Slides

##### E1. Cover (built 2026-09-28)

Accent `yellow`. Title "Midterm Exam", kicker `Week 08`, `# IT-230`, and the
agenda list: Midterm Exam, Showing Your Work, Study Guide.

```yaml
courseInfo:
  summary: >-
    This week is the Midterm exam. Work through the study guide, write the
    steps for every item in your notes, and use those notes on the exam.
```

##### E2. VM reminder (built 2026-09-28)

The standard `layout: section` reminder from `w07.md`: "Start `workstation`,
`servera`, and `serverb` on your VDI".

##### 1. Midterm Exam, section (built 2026-09-28)

`layout: section`, `routeAlias: midterm-exam`, and `topicInfo` declaring
`IT-230 - Midterm Study Guide` with source
`./exercises/midterm-study-guide-exercise.html`. No alignments. Heading
`# Midterm Exam`.

##### 2. Midterm Exam (built 2026-09-28)

From "IT-230 Exams". Same `two-cols-header`, warning and danger callouts, and
the difficult-exam illustration on the right, copied into
`it230-exams/assets/`. The instructor replaced `vertical: start` with
`leftWidth: 58` and `listSpacing: padded` (2026-09-28). Changes:

- Title "IT-230 Exams" became "Midterm Exam".
- "Essentially shortened RHCSA practice exams" became "Essentially a shortened
  RHCSA practice exam".
- "Taken in the SCC Lab environment" became "Taken in the SCC Lab on the SCC
  VDI", from the study guide's first sentence.
- The danger callout became "No AI, and no other website, material, or
  resource is allowed".

##### 3. Worth 15% (removed 2026-09-28)

Built from "Grades" as a `center` slide,
`# The Midterm is <AccentText>15%</AccentText> of your course grade`, then
removed by the instructor.

##### 4. No AI (folded into slide 2)

Not built as its own slide (Decision 6).

##### 5. Screenshots Are Your Proof (built 2026-09-28)

New, from the study guide's second paragraph. Default layout,
`listSpacing: padded`: the professor cannot access your lab; every item needs
a screenshot that proves it is done, with the directory and edited-file
examples as sub-bullets; and a `danger` Callout, "No screenshot, no credit".

##### 6. Show Your Work (built 2026-09-28)

`two-cols-header`, `leftWidth: 40`, `listSpacing: padded`, with
"**<AccentText>Work</AccentText>** means your command history" under the
title (layout props and lead line as revised by the instructor, 2026-09-28). A
fixed `TerminalWindow` on the left, no `rows`, no click sequence:

```bash-session
student@servera:~$ history -c
student@servera:~$ history -w
student@servera:~$ mkdir /tmp/reports
student@servera:~$ history
    1  history -w
    2  mkdir /tmp/reports
    3  history
```

Four bullets on the right: `history -c` clears this shell's history;
`history -w` saves the empty history; finish the item, run `history`, and
screenshot it; every server used during an item. The `bottom` band holds a warning
Callout titled "Working as root?": root keeps its own history, so after
`sudo -i` run both commands again and screenshot root's `history` as well.

##### 7. Study Guide (removed 2026-09-28)

Built as a `center` slide: `# Study Guide`, the instructor's prose verbatim as
one paragraph, then the link as a level 2 heading. The instructor liked the
content but not the presentation, and removed it in favor of slide 7a
(Decision 14).

##### 7a. Midterm Study Guide (built 2026-09-28)

The same content in the `exercise` layout, the workflow slide students see at
the end of every section. The layout supplies "Hands-on exercise",
"Exercise:", and the Goal, Environment, and Workflow labels.

- **Title:** `# Midterm Study Guide`
- **Goal:** Do well on the Midterm by building notes now (the instructor's
  wording, 2026-09-28)
- **Environment:** **Hosts:** `workstation`, `servera`, and `serverb`
- **Workflow:** 1. Open the Midterm Study Guide; 2. Work through every item;
  3. Write all the steps for each item in your notes; 4. Use those notes on
  the Midterm

The step 1 link opens in a new tab, like the "Written exercise" links on
recording slides, because the study guide's own way back is the week overview:

```html
<a href="../resources/midterm-study-guide-exercise.html" target="_blank"
  rel="noopener noreferrer"
  aria-label="Open the Midterm Study Guide in a new tab">Midterm Study Guide</a>
```

The link text is "Midterm Study Guide"; only the page's own title carries the
"IT-230 - " prefix.

## Study guide page (built 2026-09-28)

`midterm-study-guide-exercise.html` uses the stylesheet all 48 exercise
documents share, byte for byte except one line: the step counter label reads
"Item" instead of "Step". It keeps the header links to `../../../` and the
`← Back to week overview` link to `../`. The document title and `h1` are
"IT-230 - Midterm Study Guide", matching the declared title.

- Kicker "Study guide"; skip link "Skip to study guide"; navigation label
  "Study guide navigation".
- **Overview:** a `note` aside, "How to use this study guide", with the
  instructor's prose minus its first sentence (which refers to "the link
  below") and minus "go". Then the three introduction paragraphs, with
  `history -c` and `history -w` in a `pre` block as in the source.
- **Items:** an `ol.steps` of nine items. Each has the task title as its `h2`,
  the history reminder as a `note` aside, a `dl.requirements` with the host,
  and the sub-items as an ordered list, in the source's order. Item 3's example
  command stays a nested list.

## File inventory

- `course/w08.md` (new)
- `tests/site.test.mjs` (`"w08"` added to the published weeks)
- `course/chapters/it230-exams/midterm-exam.md` (new)
- `course/chapters/it230-exams/exercises/midterm-study-guide-exercise.html` (new)
- `course/chapters/it230-exams/assets/difficult-exam-decoration.png` (copy)
- `course/w07.md` (accent `red` to `pink`)
- `w07-porting.md` (accent record updated)

## Exercises

None. The study guide travels the exercise pipeline but is not a type-along
exercise: no `.sh` command file, no recording, no exercise slides.

## Additions

- Slide 5 and the root-shell caveat on slide 6.
- The instructor's prose in the study guide overview.
- Slide 7a, which replaced slide 7.

## Corrections

- The source's "## Tasks" heading is not carried over. The items follow the
  overview as `h2` sections labelled "Item 1" to "Item 9", which is how the
  exercise documents structure their steps; a "Tasks" `h2` above them would
  have made the item headings its siblings rather than its children.
- Host names in the Host lines are set as code, as in the exercise documents.
  The wording is unchanged.
- The blank lines between sub-items in the Markdown (answer space in the Word
  version) do not carry into HTML.
- A doubled space in item 3.1 is single.

## Not ported

- `~/s/IT-230/exams/Midterm.md` and every other exam, answer, or grade file.
  Only the study guide is published.
- `course-overview.md` slides listed under Source-to-fragment map.

## Verification

Checked on the instructor lab through `pnpm lab`, 2026-09-28:

- Slide 6's transcript was run exactly as shown: after `history -c` and
  `history -w`, `mkdir /tmp/reports` and `history` print
  `    1  history -w`, `    2  mkdir /tmp/reports`, `    3  history`.
  `HISTCONTROL=ignoredups`, `HISTTIMEFORMAT` unset.
- Without `history -w`, a new shell loads the old commands back. With it, a
  new shell's history starts at `history -w`.
- After `sudo -i`, root's commands land in root's history and not in
  `student`'s, which records only `sudo -i`. This is the slide 6 caveat.
- Every test pointed `HISTFILE` at a scratch file under `/tmp`. The scratch
  files and `/tmp/reports` were removed. `student`'s real `~/.bash_history`
  has the same checksum and line count (100) as before, and
  `/root/.bash_history` still does not exist.
- `/etc/yum.repos.d/rhel-dvd.repo` exists on `servera` and contains `baseos`
  lines (item 1). `/etc/profile.d` exists (item 2). `America/Chicago` is a
  valid time zone (item 7).
- `tuned` and `httpd` are not installed on `servera`, so items 5, 6, and 9
  include installing them. The `network-throughput` profile appears in the
  recorded `tuned-adm list` output of the tuning exercise. No change made.

Checks on 2026-09-28: `check:entry`, `check:slides --verbose` (no overflow;
tightest clearance is slide 4 at 0.02px, the illustration filling its column
as it does in week 1), and `check:exercises` (no violations) all pass for
`course/w08-draft.md`. `pnpm run test` passes and the study guide passes
`prettier --check`. Every slide was captured at 1920x1080 and the study guide
at 1280 wide.

## Authoring notes

- The study guide's link text on the week page is its declared title. The
  "titles end in Exercise" convention is not enforced, and this is the one
  place it does not apply.

## Publication

Approved by the instructor on 2026-09-28, early so students have the study
guide before exam day.

1. Renamed `course/w08-draft.md` to `course/w08.md`.
2. Added `"w08"` to the published-week list in `tests/site.test.mjs` (the
   production metadata test enumerates canonical weeks).
3. Ran `pnpm check`.

## Decisions

All answered by the instructor on 2026-09-28.

1. Accepted. New chapter directory `course/chapters/it230-exams/`, so Week 16
   can add `final-exam.md` beside `midterm-exam.md`.
2. Accepted. Filename `midterm-study-guide-exercise.html`.
3. Changed. Accent `yellow` for the Midterm; `red` is reserved for the Final,
   and `w07` moved from `red` to `pink`.
4. Accepted. Keep the E2 VM reminder slide.
5. Accepted, then reversed: the instructor removed slide 3, the 15%
   weighting.
6. Accepted. Fold the AI rule into slide 2's danger callout.
7. Accepted. Include slide 5, the screenshot requirement.
8. Accepted. Root-shell caveat on slide 6, verified.
9. Accepted. Copy the illustration into `it230-exams/assets/`.
10. Accepted. The instructor's prose leads the study guide overview.
11. Rejected. The study guide keeps "IT-230 - " in its heading, so the
    declared title, document title, and week-page link text are all
    "IT-230 - Midterm Study Guide".
12. Accepted. No curriculum alignments on the topic.
13. Accepted. The cover summary text under E1.
14. Slide 7a (the exercise layout) kept; slide 7 (the prose, centered, with a
    heading link) removed.

## Open questions

None. Answered 2026-09-28: the Lab Assignments block stays (the study guide is
the week's only Canvas lab); the week publishes early, before exam day; and
`mkdir /tmp/reports` stays as slide 6's example.
