# Publishing from Metadata

## Purpose

Replace the hand-maintained `slides.config.mjs` registry with a metadata-driven
publishing pipeline. A canonical weekly composition file is both the source of
the presentation and the decision to publish it:

```text
course/w01.md exists       -> publish Week 01 at /w01/
course/w02.md is absent    -> do not publish Week 02
course/w02-draft.md exists -> allow focused review, but do not publish it
```

The weekly composition and the metadata on its imported topic sections will
become the single source for:

- the Slidev presentation;
- the supplemental PDF;
- the course-site weekly overview;
- the Canvas-safe weekly HTML fragment;
- Red Hat Academy chapter references;
- RHCSA Cert Guide chapter references;
- the meeting agenda and section links; and
- student-facing HTML exercises.

The implementation must preserve the existing safety, accessibility, public
content, validation, and build-output contracts while removing duplicated
metadata and manual registration.

## Desired student experience

Each published week should present the material in the intended learning order:

1. **Before class:** read the listed Red Hat Academy chapters.
2. **In class:** follow the meeting agenda, open each presentation section, and
   complete its associated hands-on exercises.
3. **After class, optional:** read the listed RHCSA Cert Guide chapters and use
   the separately assigned labs.

The site and Canvas must contain the same instructional information. The site
may use the full IT-230 design system; the Canvas version must use conservative,
Canvas-accepted HTML and inline styles. Do not publish or describe the Red Hat
Academy labs on the course site or in the generated Canvas fragment.

A weekly overview should have this semantic structure. This example uses the
reviewed Week 01 alignments; de-duplication shows each repeated chapter once.

```text
Week 01
Weekly summary

Before class
Red Hat Academy
- RH124 — Chapter 02 — Accessing the Command Line
- RH124 — Chapter 09 — Redirecting Shell Output
- RH124 — Chapter 10 — Managing Local Users and Groups
- RH134 — Chapter 00 — Preface

In class
Meeting Agenda
Open presentation · Download Slides (PDF)
- Course Introduction
  - Open Course Introduction slides
- Accessing the Lab Environments
  - Open Accessing the Lab Environments slides
- Bash Prompt
  - Open Bash Prompt slides
- Output Redirection
  - Open Output Redirection slides
  - Start the Output and Redirection exercise
- Pipe Operator
  - Open Pipe Operator slides
- Sudo
  - Open Sudo slides

After class · Optional
RHCSA Cert Guide
- Chapter 02 — Using Essential Tools
- Chapter 06 — User and Group Management
```

The presentation link is the primary action. The PDF is a less-prominent,
supplemental download and must not be described as an accessible replacement
for the hosted presentation.

## Architectural decisions

### Canonical weekly files are the publication boundary

Discover only root-level filenames matching `course/w01.md` through
`course/w16.md`. Sort them by week number before validation and rendering.

Discovery is now the publication decision itself, so specify it exactly rather
than leaving it to the implementation. Read the course root with a single
non-recursive `readdir`, passing `withFileTypes`. If a matching canonical name
is not a regular file, fail discovery rather than ignoring it or passing it to
the parser. Match with the anchored pattern
`^w(0[1-9]|1[0-6])\.md$`; anchoring is what keeps `w02-draft.md` from matching
on a substring and publishing a draft, and the alternation excludes `w00` and
`w17`. Do not filter a recursive listing after the fact — a non-recursive read
cannot reach `course/archive/w03.md` in the first place, and the filter is where
the mistake would otherwise live. Resolve each match through the existing
`assertExistingFileInside` in `scripts/lib/paths.mjs` rather than writing new
checks; its realpath and containment guard is what stops a canonical week from
being a symlink into private material, and it already backs the registry today.

- Do not recursively discover Markdown beneath `course/chapters/`.
- Do not publish `course/w02-draft.md`, `course/week-02.md`, files in a draft
  directory, or any other noncanonical filename.
- Continue allowing focused `dev`, `review`, and `capture:course` commands to
  open any validated Markdown entry beneath `course/`, including
  `course/w02-draft.md`.
- Renaming `course/w02-draft.md` to `course/w02.md` is the explicit publication
  decision.
- Removing `course/w02.md` unpublishes that week on the next complete build;
  rebuilding `dist/` from scratch removes its old output.
- A malformed canonical week must fail validation and block publication. Never
  silently omit a discovered but invalid week.

The first implementation intentionally publishes weekly entries only. Remove the
durable standalone presentation-ID convention — the `(?:it230|rh124|rh134)-…`
alternative in the registry's `PRESENTATION_ID` pattern. It carries no course
content today, but it is not unused: `it230-integration` is the identifier of
the integration fixture in `tests/fixtures/site/slides.config.mjs`, hard-coded
across `scripts/check-site.mjs` and `tests/site.test.mjs`. Removing the
convention is therefore a fixture rename in Phase 1, not a deletion. A future
standalone publication type should receive its own explicit filename and
metadata contract instead of broadening discovery implicitly.

Identifiers stop being authored input. Nothing declares an `id`; the catalog
derives it from the canonical filename, and that derived value names the route
`/wNN/`, the output directory, and `SCC-IT-230-wNN.pdf`. A draft never yields an
identifier at all, because discovery does not match it.

**Enduring → `docs/architecture.md`, `AGENTS.md`.** The discovery rule, canonical
existence as the publication decision, and identifiers derived from filenames.

### Resources are week-owned

Canonical exercise sources are topic-owned and may be reused by multiple weeks.
Each published copy and URL is week-owned: the same canonical exercise may be
copied beneath more than one `/<id>/resources/` directory when more than one
week imports its topic. There is no shared or global publication route. The
route `/<id>/resources/` follows from ownership of the published copy rather
than from a separate resource namespace.

This mirrors how the material is organized for students in Canvas, where a
module gathers the week's page, slides, and exercises. It is also why the
generic registry resource contract — any repository file, any extension,
declared beside the presentation — collapses into `topicInfo.exercises` declared
by the owning topic. Weekly ownership, not file type, is the reason the schema
narrows.

**Enduring → `docs/architecture.md`.** Weekly ownership is the reason the
resource contract has its shape; without it the rewrite drifts back.

### Keep a computed catalog, not an authored registry

Replace `scripts/lib/registry.mjs` with a module such as
`scripts/lib/presentations.mjs`. It should discover, parse, validate, normalize,
and freeze an in-memory object with the shape expected by the build, renderer,
and link checker:

```js
{
    presentations: [
        {
            id,
            title,
            summary,
            entry,
            entryAbsolute,
            accent,
            academyChapters,
            certGuideChapters,
            agenda,
            resources,
            sourceFiles,
        },
    ],
}
```

This preserves a clear internal boundary without asking authors to maintain a
second source of truth. Rename registry-oriented functions and parameters to
catalog- or presentation-oriented names as part of the migration; do not leave
`registered` terminology describing filesystem discovery.

`accent` is the deck's resolved `themeConfig.it230Accent`, and the weekly
overview must consume it so each published week carries its own accent instead
of the single frozen blue the landing page uses today. Resolve it with the
existing `resolveIt230Accent` and emit the three custom properties returned by
`accentCssVariables` scoped to that week's element. Both already exist in
`packages/slidev-theme-it230/setup/accent.ts`, `site/styles.css` already reads
those three variable names, and the nine accents already carry the theme's
documented contrast work. Do not restate the palette in `site/styles.css`: the
current blue triplet there duplicates the theme's default, and a second copy
would drift.

**Enduring → `docs/design-system.md`.** Each week renders in its deck's accent,
and the palette is sourced from the theme package rather than restated in
`site/styles.css`.

Discovery must accept an injectable course root. `scripts/check-site.mjs`
exercises the whole pipeline against `tests/fixtures/course/` rather than the
real course, and it can only continue to do so if the catalog takes the course
root as a parameter, exactly as `loadRegistry` does today.

### Week metadata belongs in deck headmatter

Extend the first headmatter block of each canonical week with a namespaced
`courseInfo` object:

```yaml
---
theme: it230
themeConfig:
  it230Accent: teal
routerMode: hash
title: Week 01 — Course Introduction and Command-Line Refresher

courseInfo:
  summary: >-
    Hello! This week we will review the course, access both lab environments,
    and refresh Linux command-line fundamentals.
---
```

For the initial schema, `courseInfo` contains only the custom weekly summary.
The presentation title remains the standard Slidev `title`, and the selected
accent remains `themeConfig.it230Accent`. Do not duplicate the agenda,
curriculum alignment, exercises, ID, route, or PDF filename in `courseInfo`.

`parser.load` returns the entry deck's raw headmatter, so reading `courseInfo`
never depends on Slidev's configuration resolution. Slidev 52.18.0 assigns no
behavior to unknown headmatter keys and `verifyConfig` does not reject them,
while `resolveConfig` spreads them into the resolved configuration — so
`courseInfo` also ships inside the built deck bundle as public text. Keep the
custom data under this single namespace to minimize collision risk, validate it
independently during catalog construction, and retest the behavior whenever
Slidev is upgraded.

**Enduring → `AGENTS.md`.** `courseInfo` and `topicInfo` are unenforced by
Slidev, so a Slidev upgrade must re-verify that both still survive parsing.
Attach this to the existing rule about refreshing pinned Slidev dependencies.

### Topic metadata belongs on the owning section slide

Place `topicInfo` in the existing frontmatter of the section slide that starts
an agenda topic. Do not add an extra frontmatter block merely for metadata,
because that would create an unintended slide boundary.

```yaml
---
layout: section
routeAlias: output-redirection

topicInfo:
  alignments:
    redHatAcademy:
      - course: RH124
        chapter: "09"
        title: Redirecting Shell Output
    rhcsaCertGuide:
      - chapter: "02"
        title: Using Essential Tools

  exercises:
    - title: Output and Redirection
      summary: Practice overwriting and appending redirected output.
      source: ./exercises/output-redirection-exercise.html
---

# Output Redirection
```

The slide's first heading is the agenda label. `routeAlias` is Slidev's stable
deep-link identifier. `topicInfo` is a marker that the resolved slide belongs in
the generated agenda and carries its curriculum and exercise relationships.
`layout: section` is the conventional opener for a topic and is used throughout
these examples, but it is not required: `topicInfo` resolves on any layout.

- `topicInfo` must be a plain object.
- `alignments` and `exercises` are optional.
- An empty `topicInfo: {}` is valid for an agenda section with no curriculum
  alignment or exercise.
- Both curriculum fields are arrays, even when a topic has one alignment.
- Topic metadata remains on the canonical fragment, not on the weekly `src`
  import block. An import block's frontmatter is applied to every slide in the
  imported range, so `topicInfo` placed there fans out across the whole
  fragment.
- Reject `topicInfo` declared on an import block. Deck-wide alias uniqueness and
  the per-topic alias requirement already detect that fan-out; this check exists
  to replace a cascade of confusing errors with one pointed message naming the
  offending import block. Do not guard `routeAlias` or `layout`: alias
  uniqueness already covers the former, and overriding a layout from an importer
  is legitimate Slidev usage.
- A fragment may contain internal slides, including further `layout: section`
  slides, that are not agenda entries. Only resolved slides carrying `topicInfo`
  participate.
- If a fragment intentionally contains multiple agenda topics, each may have
  its own `topicInfo` and unique `routeAlias`.

Do not infer curriculum data from directory names. Directory names express
alignment for organization, but student-facing course numbers, chapter
numbers, and titles must be explicit, reviewed metadata.

**Enduring → `docs/course-authoring.md`.** The topic schema authors write every
week: `topicInfo` on the slide that opens the topic and never on the weekly
import block, any layout, a heading for the agenda label, a unique
`routeAlias`, and explicit curriculum metadata rather than inferred.

## Slidev import resolution

Use the pinned `@slidev/cli` parser's asynchronous `parser.load` operation as
the authoritative resolver instead of implementing a second Markdown import
parser. Supply the repository/course roots as allowed roots so imported paths
cannot escape the public project boundary.

For each discovered week:

1. Load the complete deck and resolve nested `src` imports.
2. Treat any parser-reported problem as a validation failure. `parser.load` does
   not throw: it records missing files, circular imports, invalid ranges, and
   escaped imports as `{row, message}` entries on the owning `SlidevMarkdown`,
   then resolves successfully with the offending slides absent. A mistyped `src`
   path would otherwise publish a week silently missing a topic. Aggregate the
   errors from the unique `SlidevMarkdown` objects in `data.markdownFiles`,
   which already includes `data.entry`, and fail when any remain without
   duplicating entry errors.
3. Inspect the resolved slides in their final presentation order.
4. Select resolved slides whose effective frontmatter contains `topicInfo`.
5. Retain each selected slide's source filepath so exercise paths resolve
   relative to the fragment that declares them.
6. Use the resolved slide title and effective `routeAlias` when constructing
   the agenda.
7. Include topic metadata only when its slide is included by the effective
   import range. Metadata from a fragment whose section slide was excluded must
   not leak into the week.
8. Retain the complete set of entry and imported Markdown paths for validation
   diagnostics and live-reload watching.

Resolved slide order, not filesystem order or curriculum chapter number, is
the authoritative meeting-agenda order.

## Metadata validation

Validation must run before deleting or replacing generated output.

### Weekly entry validation

For every discovered `course/wNN.md`:

- derive `id` from the filename and reject any mismatch if an ID-like custom
  field is introduced accidentally;
- require `theme: it230`;
- require `routerMode: hash`;
- validate `themeConfig.it230Accent` through the existing central theme
  validator;
- require a nonempty, trimmed `title`, read from
  `data.entry.slides[0].frontmatter` rather than the returned `headmatter`,
  because `parser.load` back-fills `headmatter.title` from the first slide's
  heading whenever the key is absent, so an omitted `title` would otherwise
  inherit the cover slide's heading and pass validation;
- require exactly the supported `courseInfo` fields;
- require a nonempty, trimmed `courseInfo.summary`;
- preserve the existing realpath, symlink, and containment checks; and
- reject the aggregated parser errors described above before treating the deck
  as publishable.

### Agenda-section validation

For every resolved slide with `topicInfo`:

- require a nonempty, trimmed, student-facing title. Do not require
  `layout: section`, and do not require heading level one: `topicInfo` resolves
  on any layout, `parseSlide` derives the title from the first heading of any
  level, and a slide that sets `title` in its frontmatter leaves `level`
  undefined;
- require a `routeAlias` matching
  `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` on every `topicInfo` slide;
- require aliases to be unique across every resolved slide in the deck rather
  than across topic slides alone, because Slidev resolves a hash against any
  slide's alias;
- reject an alias that conflicts with Slidev's numeric routing or contains URL
  delimiters, which the required leading letter and canonical pattern enforce;
- require `topicInfo` and its nested fields to contain only documented keys;
  and
- report the declaring source file and slide number in every error.

Use the route alias for generated section links. The Canvas form below shows the
default origin; the Canvas renderer composes it rather than embedding it.

```text
site:   /w01/#/output-redirection
Canvas: https://it230.systemsmetanow.tech/w01/#/output-redirection
```

The ordinary generated-site link checker can verify the `/w01/` document, but
the hash is client-side. Therefore, metadata validation must prove that every
generated alias belongs to a resolved slide, browser review must exercise a
representative named route, and the link checker must validate every generated
resource destination against the built `dist/` tree. Manual clicking
complements these deterministic checks but does not replace them.

### Curriculum-alignment validation and de-duplication

Red Hat Academy alignment identity is `(course, chapter)`:

```text
RH124 + 09
```

RHCSA Cert Guide alignment identity is the chapter number within the one guide
used by this repository. Its display heading can remain a course-wide constant
while each topic declares chapter and title. If the repository supports another
guide or edition later, add a guide identity to the schema and de-duplication
key as an explicit migration.

- Keep chapter numbers as quoted two-digit strings matching `^\d{2}$` so
  leading zeroes survive.
- Restrict Academy course identifiers to `RH124` and `RH134`.
- Require nonempty, trimmed titles.
- Collapse identical Academy identities across topic sections.
- Collapse identical Cert Guide chapter identities across topic sections.
- If the same identity carries different titles, fail validation rather than
  choosing one silently.
- Sort the final Academy list by course and numeric chapter.
- Sort the final Cert Guide list by numeric chapter.
- Keep curriculum sorting independent from the meeting-agenda order.

Thus, Output Redirection and Pipe Operator may both declare the same Academy
and Cert Guide chapters. The weekly overview shows each chapter once while the
agenda retains both topics in presentation order.

### Exercise validation and de-duplication

Exercise sources are relative to the Markdown fragment that declares them.
For each exercise:

- require only `title`, `summary`, and `source`;
- require nonempty, trimmed student-facing text;
- require a canonical lowercase basename ending in `-exercise.html`;
- require the source to resolve to an existing regular file inside the owning
  topic's `exercises/` directory;
- reject symlinks or paths escaping the repository/topic boundary;
- reject a basename colliding with `SCC-IT-230-<id>.pdf`;
- de-duplicate repeated references to the same real source file, but fail
  validation when those references carry different `title` or `summary` text
  rather than silently choosing one, matching how a curriculum identity with
  conflicting titles is treated;
- preserve exercise declaration order within its agenda topic;
- if the same exercise is reached through more than one topic, show it beneath
  the first owning topic in resolved presentation order; and
- reject different source files that would publish to the same week-local
  resource basename.

Publish collected exercises beneath the existing route:

```text
/w01/resources/output-redirection-exercise.html
```

Do not scan exercise directories automatically. Explicit topic metadata keeps
publication, ordering, titles, and descriptions reviewable.

## Rendering

### Shared content model

Create one normalized weekly view model from the computed presentation catalog
and pass it to separate site and Canvas renderers. The model must contain the
same text, hierarchy, and destinations for both outputs. Renderers may vary
markup and presentation but must not independently derive or rewrite
instructional content.

Use descriptive action labels generated from the agenda title and exercise
title, for example:

- `Open Output Redirection slides`
- `Start the Output and Redirection exercise`
- `Download Slides (PDF)`

Do not use repeated ambiguous labels such as `here`, `link`, or `Exercise 1`.

### Course site

Replace the current compact presentation card with a semantic weekly overview:

- week title and summary;
- a **Before class** Red Hat Academy section, omitted when empty;
- an **In class** meeting-agenda section;
- a prominent presentation action;
- a secondary PDF download action;
- one agenda entry per resolved `topicInfo` section;
- the section deep link and exercises grouped beneath that agenda entry; and
- an **After class · Optional** RHCSA Cert Guide section, omitted when empty.

Use headings and lists that retain their meaning without CSS. Preserve the
Adwaita-inspired IT-230 tokens, background, rounded surfaces, restrained depth,
visible focus, underlined links, and narrow-screen reflow. Color and spatial
grouping may reinforce the before/in/after sequence but must not be the only
indicators.

Fix the heading roles rather than leaving them to the renderers, but account for
their different host documents. `site/index.html` already commits the generated
block to `h2`, so the site nests week (`h3`), phase heading (`h4`), and agenda
topic (`h5`), with exercises as list items beneath their topic rather than as a
sixth level. Canvas supplies the page title outside the pasted fragment, so the
fragment uses week (`h2`), phase heading (`h3`), and agenda topic (`h4`). The
semantic roles match even though the literal levels are offset. Skipped levels
are an accessibility defect, so record both maps here.

**Enduring → `docs/design-system.md`, `docs/accessibility.md`.** The heading map
only. The template-contract details below are already owned by those documents
or self-evident in `site/render-template.mjs`.

Reuse the existing template contract instead of rewriting it. `renderLandingPage`
in `site/render-template.mjs` escapes every interpolated value through
`escapeHtml` and requires the `<!-- IT230_MATERIAL_SECTIONS -->` marker to appear
exactly once; the rewrite keeps both, keeps the `.skip-link` target
`#main-content`, and preserves the About section's attribution, including the
statement that the college and Red Hat do not operate or endorse the site.

The landing page may become long as more weeks are published. Keep every week
directly reachable and preserve heading navigation; do not hide essential
content behind script-dependent controls. Reassess a compact index or in-page
week navigation only after multiple real weeks make the need concrete.

### Canvas HTML

Generate one public but unlinked authoring utility for every published week at
`/weeks/<id>/canvas/`. The utility displays the Canvas fragment as escaped,
copyable source in a read-only text area and provides a copy button with a
manual-selection fallback. It is built only beneath `dist/`; no Canvas HTML is
written to `exports/`. The fragment is manually pasted into the Canvas Rich
Content Editor's raw HTML view; the implementation does not call the Canvas API,
store credentials, or overwrite external pages.

The Canvas renderer must:

- use the same weekly view model as the site;
- generate an HTML fragment rather than a complete document;
- use semantic headings, paragraphs, and lists accepted by Canvas;
- use conservative inline styles only, with no `<style>` or `<script>`;
- avoid depending on site CSS classes or custom properties;
- use the fixed IT-230 light palette with independently checked contrast;
- use absolute public links composed from a single configured origin rather than
  a literal in the renderer. Add `IT230_PUBLIC_ORIGIN`, defaulting to
  `https://it230.systemsmetanow.tech`, and build every URL as that origin joined
  to `withSiteBase(siteBase, …)` over the existing `presentationRoute` and
  `presentationResourceRoute` helpers. Hard-coding the host would bypass
  `IT230_SITE_BASE` and silently emit wrong links under a project subpath
  deployment;
- validate `IT230_PUBLIC_ORIGIN` as an HTTPS origin with no credentials,
  non-root path, query, or fragment, and normalize it through `URL.origin`
  before joining paths;
- include `target="_blank"` and safe `rel` values where appropriate;
- escape all metadata text and attribute values;
- preserve readable structure if Canvas strips the optional styling; and
- contain no Canvas course ID, access token, student data, or term-specific
  identifier.

**Enduring → `docs/architecture.md`.** `IT230_PUBLIC_ORIGIN` joins
`IT230_SITE_BASE` as a deployment input, and absolute URLs are composed from it
rather than written literally.

After generating the first authoring page, copy its fragment into the Week 01
Canvas page, save it, reopen HTML view, and compare the retained markup with the
source. Adjust only to Canvas's documented allowlist. Review the saved result on
desktop and narrow layouts before extending the workflow to later weeks.

Do not add automatic Canvas API publication in this migration. That would
introduce authentication, external-state mutation, page identifiers, overwrite
semantics, and a separate authorization boundary.

## Build and command changes

### Complete build

Change `pnpm build` / `pnpm run build:site` to:

1. discover canonical week files;
2. build and validate the complete computed catalog;
3. validate all output paths before removing `dist/`;
4. recreate `dist/`;
5. render the course landing page, weekly detail pages, and unlinked Canvas
   authoring utilities;
6. build each discovered Slidev presentation without notes;
7. export `SCC-IT-230-<id>.pdf` into the week resources directory;
8. copy the exercises collected from imported topic metadata; and
9. validate generated files and links.

Canvas fragments are generated only as encoded source inside the authoring
utilities beneath `dist/`. They are public, despite being absent from student
navigation, and are not sent to Canvas automatically.

### Focused commands

- `build:deck -- w01` and `export:pdf -- w01` resolve directly to
  `course/w01.md` and require that canonical published week to exist.
- the complete site build generates Canvas source for every canonical published
  week from the same normalized metadata;
- `dev -- course/w02-draft.md`, `review -- course/w02-draft.md`, and
  `capture:course -- course/w02-draft.md` continue to accept unpublished draft
  entries.
- No command accepts arbitrary output paths or broadens generated-root cleanup.
- Update command errors from `registered deck` to `published week` or
  `canonical week`, as appropriate.

### Landing-page development

Replace registry watching with source-aware watching:

- watch the root `course/` directory for creation, removal, or rename of
  canonical `wNN.md` files;
- after successful catalog construction, watch the set of directories containing
  the canonical entries, imported Markdown sources, and declared exercise
  sources used by the catalog;
- continue watching the landing-page template, renderer, and stylesheet;
- rebuild the watch set after each successful reload because imports may have
  changed;
- debounce filesystem events and serialize reload work;
- on invalid edits, report the error and continue serving the last valid page;
  and
- close replaced watchers so repeated edits do not leak handles.

Watch directories, never individual files. On Linux a file watch binds to the
inode rather than the path, and editors that save by writing a temporary file
and renaming it over the target leave that watch bound to an unlinked inode — the
watcher survives as a live handle that never fires again, so live reload dies
silently for whichever file is being edited most. `scripts/lib/development.mjs`
already avoids this by watching `path.dirname(registryPath)` and comparing
basenames in the callback; keep that shape as the source set grows from two files
to roughly eight for one week and over a hundred across sixteen.

Build the known source set from the union of `parser.load().watchFiles` keys and
the normalized absolute exercise sources; exercises are not included in
Slidev's Markdown watch map. Map the union through `path.dirname`, collect the
directories into a `Set`, and open one watcher per distinct directory. Week 01
needs about five rather than eight. Because a directory watch reports every
entry within it, resolve `path.join(directory, filename)` in the callback and
reload when either the result belongs to the known source set or the directory
is the course root and the basename matches the canonical week pattern. The
second condition is what detects creation of a new `wNN.md` before it can belong
to the current catalog. Ignore unrelated events so saving a `.gif` under a
chapter's `assets/` does not rebuild the landing page. Preserve the existing 50
ms debounce and serialized reload queue.

## Implementation sequence

Keep the work unstaged for manual review. Implement in phases that leave tests
meaningful at each boundary, but do not retain a permanent dual-source system.

`pnpm check` runs format, toolchain, tests, build, and link checking in sequence,
so a phase boundary that leaves the production build and the fixture harness on
different sources is red until the next phase lands. Phase 4 is therefore one
atomic change set rather than a series of independently committable steps, and
the fixture rework moves into Phase 1 so Phase 4 has a harness to build against.

### Phase 1: Add metadata parsing and fixtures

1. Add representative fixture weeks, draft files, topic imports, duplicate
   curriculum alignments, route aliases, and exercises.
2. Convert the integration fixture from a standalone identifier to a canonical
   week. Rename `tests/fixtures/course/example.md` to a canonical `wNN.md` so
   the fixture's identifier is derived rather than declared, and replace
   `it230-integration` throughout `scripts/check-site.mjs` and
   `tests/site.test.mjs`.
3. Replace `tests/fixtures/site/resource.txt` with an HTML exercise fixture
   inside the fixture course tree, declared from a fragment's `topicInfo`.
   Keep a unique sentinel string in the file so the copy assertion continues to
   prove the correct bytes arrived rather than only that a file exists.
   Retarget the existing non-canonical path case — today
   `tests/fixtures/course/../site/resource.txt` — to a fragment-relative source
   that escapes its topic, so the containment rule keeps a test.
4. Implement canonical week discovery and deterministic sorting, taking the
   course root as a parameter so the fixture harness can point at
   `tests/fixtures/course/`.
5. Use `parser.load` to resolve imports and collect source files.
6. Implement strict `courseInfo`, `topicInfo`, curriculum, alias, and exercise
   validation.
7. Produce the frozen normalized catalog while the current production registry
   remains temporarily available to existing callers.

### Phase 2: Migrate Week 01 source metadata

1. Set the Week 01 headmatter title to
   `Week 01 — Course Introduction and Command-Line Refresher`. Add the summary
   `Hello! This week we will review the course, access both lab environments,
   and refresh Linux command-line fundamentals.` The cover slide continues to
   render its own body content through the `cover` layout's default slot; this
   title becomes the deck document title and landing-page heading.
2. Add `topicInfo` and these unique `routeAlias` values to the six Week 01
   agenda topics, using frontmatter `title` when the first slide heading is not
   the desired agenda label:
   - Course Introduction: `course-introduction`
   - Accessing the Lab Environments: `lab-environments`
   - Bash Prompt: `bash-prompt`
   - Output Redirection: `output-redirection`
   - Pipe Operator: `pipe-operator`
   - Sudo: `sudo`
3. Move the existing output-redirection exercise declaration from
   `slides.config.mjs` to its owning section fragment.
4. Add the instructor-reviewed alignments exactly as follows:
   - Course Introduction: no Academy or Cert Guide alignment.
   - Accessing the Lab Environments: RH134 Chapter `00`, `Preface`; no Cert
     Guide alignment.
   - Bash Prompt: RH124 Chapter `02`, `Accessing the Command Line`; Cert Guide
     Chapter `02`, `Using Essential Tools`.
   - Output Redirection: RH124 Chapter `09`, `Redirecting Shell Output`; Cert
     Guide Chapter `02`, `Using Essential Tools`.
   - Pipe Operator: RH124 Chapter `09`, `Redirecting Shell Output`; Cert Guide
     Chapter `02`, `Using Essential Tools`.
   - Sudo: RH124 Chapter `10`, `Managing Local Users and Groups`; Cert Guide
     Chapter `06`, `User and Group Management`.
5. Confirm that internal section slides without `topicInfo` do not create
   accidental agenda entries.

### Phase 3: Render the unified weekly overview

1. Introduce a shared weekly view-model builder.
2. Replace the site presentation-card renderer with the before/in/after weekly
   overview. The generated agenda supersedes the registry's `topics` array at
   this point; the landing page must not render both while the registry remains
   temporarily available to other callers.
3. Update `site/styles.css` using the current IT-230 design tokens. The deck
   accent owns decorative identity and link treatment; Before/In/After use
   neutral surfaces, visible labels, and structure rather than competing phase
   colors. Remove the three hard-coded root accent values from the source CSS.
   In both production and development, generate the global blue fallback block
   from `accentCssVariables(resolveIt230Accent())`, then scope each week's
   resolved accent variables to its overview element. This keeps the body
   gradient, global links, and focus indicators defined without duplicating the
   palette. Spot-check all nine accents against the site's actual surfaces;
   slide-canvas contrast does not automatically prove site contrast.
4. Add the Canvas-safe fragment renderer.
5. Add an unlinked `/weeks/<id>/canvas/` authoring-page template and generate it
   during complete site builds and site development.
6. Verify that both renderers contain the same normalized instructional text
   and destinations and that the encoded source decodes exactly to the Canvas
   fragment.

### Phase 4: Switch production and focused commands

1. Update complete build, preview, link checking, focused deck build, PDF
   export, and landing-page development to load the computed catalog.
2. Preserve generated-root and path-containment safeguards.
3. Replace registry-specific argument selection with canonical-week lookup.
4. Update live reload to follow discovered and imported source files.
5. Confirm that creating or removing a canonical week changes the next landing
   page and complete build deterministically.

### Phase 5: Remove the registry

After every consumer uses the computed catalog:

1. delete `slides.config.mjs`;
2. delete registry-only fixture configuration;
3. remove registry-loading and dynamic-module-import code;
4. remove obsolete `topics`, generic presentation-summary duplication, and
   durable-topic-ID tests, including the stale
   `assert.equal(registry.presentations[0].accent, undefined)` in
   `tests/site.test.mjs`, which inverts once the catalog carries a resolved
   accent;
5. rename remaining registry-oriented symbols and test descriptions; and
6. run a repository-wide search to ensure no stale `slides.config.mjs`,
   `registered presentation`, or `registry-driven` behavior remains.

Do not delete the registry early and temporarily hard-code Week 01 in build
scripts. The computed catalog must replace it as one coherent boundary.

### Phase 6: Update authoritative documentation

Paragraphs marked **Enduring →** name the document that owns that behavior after
the migration. They are the shortlist: translate those, and leave the rest of
this plan behind. Everything unmarked is either migration mechanics that dies
with the registry, or an implementation detail whose test or code comment is a
better home than prose. Find them with:

```sh
rg -n 'Enduring →' publishing-from-metadata.md
```

Resist restating a marked paragraph in full. Each one names a rule and the reason
it exists; the reason is what keeps a future rewrite from undoing it, and the
surrounding detail here is not needed in the owning document.

Update enduring behavior in:

- `AGENTS.md`: canonical `course/wNN.md` existence is publication approval;
  incomplete weeks use names such as `course/w02-draft.md`;
- `docs/architecture.md`: discovery, metadata ownership, normalized catalog,
  import resolution, resource routes, Canvas authoring boundary, and build
  output;
- `docs/course-authoring.md`: week and topic schemas, route aliases,
  curriculum alignment, exercises, and draft naming;
- `docs/publishing.md`: new publication decision, command behavior, review
  workflow, Canvas paste-and-review workflow, and publication gates;
- `docs/design-system.md`: site weekly-overview and Canvas visual contracts;
- `docs/accessibility.md`: equivalent information across the site and Canvas,
  descriptive deep links, and manual Canvas review;
- `README.md`: repository organization, discovery, builds, and common commands;
  and
- any command comments or messages that still describe registry membership.

This plan file is not the authoritative long-term documentation. Once the
implementation is accepted, the documents above own the resulting behavior.

## Test plan

### Discovery and publication tests

- Discover `w01.md` and `w16.md` in numeric order.
- Ignore `w02-draft.md`, nested chapter Markdown, and unsupported root names,
  including `w00.md` and `w17.md`.
- Reject a directory named `w01.md` rather than passing it to the parser.
- Prove that absence of `w02.md` does not produce `/w02/` output.
- Prove that a malformed canonical week fails the build rather than being
  skipped.
- Reject symlinked canonical entries and paths escaping the course root.
- Verify focused review still accepts a valid `w02-draft.md`.

### Metadata and import tests

- Parse and validate `courseInfo.summary`.
- Resolve direct, nested, repeated, and ranged Slidev imports.
- Reject missing, escaped, and circular imports through the aggregated parser
  errors, including a mistyped `src` path that would otherwise drop a topic
  silently.
- Generate agenda entries only for resolved slides carrying `topicInfo`.
- Preserve resolved slide order.
- Require a usable title and a unique canonical route alias, and accept a topic
  slide whose layout is not `section`.
- Reject `topicInfo` declared on a weekly import block, and prove the fan-out
  case reports the import block rather than every slide in the imported range.
- Confirm a named section route survives the production Slidev build.

### Curriculum tests

- De-duplicate identical Academy course/chapter alignments.
- De-duplicate identical Cert Guide chapters.
- Reject conflicting titles for one identity.
- Sort Academy chapters by course and chapter.
- Sort Cert Guide chapters numerically.
- Preserve agenda order independently from curriculum sort order.
- Allow an agenda topic with no curriculum alignment.

### Exercise and resource tests

- Resolve exercise sources relative to the declaring fragment.
- Require existing canonical `-exercise.html` files beneath the owning
  exercises directory.
- Reject escapes, symlinks, unsupported extensions, PDF collisions, and
  basename collisions.
- De-duplicate the same real exercise source reached more than once.
- Keep exercises grouped under the first owning agenda topic.
- Copy the expected HTML file to `/<id>/resources/`.
- Verify all generated resource links under `/` and a project subpath base.

### Rendering tests

- Escape all metadata in site HTML and Canvas HTML.
- Omit empty Academy and Cert Guide sections without leaving broken heading
  structure.
- Render a prominent browser-presentation action and secondary PDF action.
- Render each week in its declared accent, and prove a week with no declared
  accent falls back to the resolver's blue default.
- Render descriptive section and exercise links.
- Prove the site and Canvas outputs use the same normalized strings and URLs by
  building one view model, extracting the ordered `{text, href}` pairs from each
  generated weekly overview only, and asserting the two sequences are equal
  once the Canvas origin prefix is removed. Exclude the site's About and source
  repository links, which are outside the shared weekly view model. Parity
  asserted any less concretely is not testable.
- Require absolute public URLs in Canvas output.
- Reject scripts, style elements, event attributes, relative links, and
  unsupported Canvas markup from the generated fragment.
- Preserve meaningful HTML when inline styles are removed.

### Build and development tests

- Build every discovered week, PDF, and exercise resource.
- Keep presenter notes out of production decks.
- Validate generated links and required files.
- Verify `build:deck` and `export:pdf` reject absent weeks and Canvas authoring
  pages exist only for published weeks.
- Verify landing-page live reload after week metadata, topic metadata, exercise,
  renderer, stylesheet, creation, rename, and removal changes.
- Verify live reload still fires after a watched source is replaced by writing a
  temporary file and renaming it over the original, which is how editors save and
  what a per-file watcher would not survive. Reload twice in a row to prove the
  watcher stayed alive rather than firing once and going quiet.
- Verify an invalid live edit leaves the last valid landing page available.

### Manual review

- Run `pnpm check` after focused tests pass.
- Review Week 01 slides at the 1920x1080 presentation viewport.
- Open every generated named section route.
- Review the course site at desktop and narrow widths for hierarchy, reflow,
  focus, keyboard operation, contrast, and overflow.
- Verify that the PDF is presented as supplemental.
- Copy `/weeks/w01/canvas/` into Canvas, save it, inspect the sanitized result,
  and compare its content with the course site.
- Review the saved Canvas page at desktop and narrow widths with keyboard and
  assistive-technology considerations.
- Confirm no labs, solutions, private notes, credentials, student data,
  restricted curriculum content, or unapproved branding were introduced.

## Completion criteria

The migration is complete when:

- `slides.config.mjs` no longer exists;
- canonical week discovery is the only production publication mechanism;
- `course/wNN-draft.md` remains reviewable but unpublished;
- Week 01 metadata is sourced from its headmatter and resolved topic sections;
- curriculum lists are correctly de-duplicated and ordered;
- the agenda follows presentation order and links to stable named sections;
- exercises appear beneath their owning agenda topics and publish under the
  week resources directory;
- the site and Canvas fragment contain equivalent instructional information;
- all production, focused, preview, export, live-reload, and link-check commands
  use the computed catalog;
- authoritative documentation describes the new workflow;
- automated validation passes;
- desktop, narrow-site, presentation, named-route, PDF, and saved-Canvas manual
  reviews are complete; and
- all prospective changes remain unstaged until the instructor explicitly
  approves them.
