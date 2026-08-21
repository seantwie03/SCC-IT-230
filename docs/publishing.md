# Publishing

## Normal workflow

The repository has one maintainer and uses `main` as its sole working and
publishing branch. Work locally on `main`, run the complete validation suite,
review the prospective commit as public material, commit, and push directly to
`main`. Do not use feature branches or pull requests.

The scripts in the root `package.json` are the authoritative commands for
local development, validation, and builds. Use a frozen pnpm installation when
verifying a clean checkout.

Install and validate from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm check
```

If the format check reports a supported file, apply the configured formatter
and validate again:

```sh
pnpm format
pnpm check
```

## Course-site development and production review

The course commands distinguish rapid source review from exact production
review:

```sh
pnpm dev
pnpm dev -- course/w01.md
pnpm run review
pnpm run review -- course/w01.md
pnpm run capture:course -- course/w01.md
pnpm build
pnpm run build:site
pnpm run build:deck -- w01
pnpm preview
```

With no argument, `dev` and `review` serve the metadata-driven course site,
including its landing page, weekly details, Canvas-authoring utilities, and
exercise resources. They reload the browser after a valid change to canonical
week discovery, an imported topic, an exercise, shared catalog or view-model
code, a site template, a renderer, or the stylesheet. Each reload uses a fresh
module graph, includes accent-palette changes, keeps serving the last valid
artifact set if an edit is invalid, and does not start Slidev. Render workers
have a fixed timeout and are terminated when rendering settles or the server
stops. With exactly one argument, they start one Slidev development server for
that validated Markdown entry beneath `course/`, whether it is a canonical week
or a noncanonical draft. Focused review does not publish the entry, add it to
the landing page, or change `dist/`.

[`capture-course.mjs`](../scripts/capture-course.mjs) exports the same kind
of validated entry directly to deterministic PNG images under
`exports/course-review-png/`, replacing that fixed directory on every run.
With no page-range argument it captures every slide; with one validated
range such as `1,4-7`, it captures only those slides. Use it for batch or
scripted review when a live browser session is unnecessary; use `review` for
interactive inspection. Like `dev`/`review`, it accepts a published or draft
entry and never touches `dist/` or the landing page.

Production operations discover root-level `course/w01.md` through
`course/w16.md`. A canonical filename is publication approval; keep incomplete
weeks under names such as `course/w02-draft.md`. `pnpm build` generates the
theme gallery and then runs `build:site`, which validates the complete computed
catalog and pre-renders its static artifacts before recreating `dist/`. It then
generates the compact landing page and weekly detail pages and builds each
published deck without presenter notes. A malformed week, template, Canvas
fragment, or exercise therefore cannot erase the previous complete build. A
detail page is published at `/weeks/<id>/`, its slides at
`/weeks/<id>/slides/`, and its PDF and topic-declared HTML exercises beneath
`/weeks/<id>/resources/`.
`build:theme` and `build:site` retain those focused build operations.
`build:deck` accepts one published week ID and produces the same web deck,
supplemental PDF, and exercises without replacing the existing week detail
page. `export:pdf` also accepts one published week ID, but writes a separate
review copy under `exports/`.

The complete site build publishes a Canvas-authoring utility at
`/weeks/<id>/canvas/` for every published week. It is intentionally absent from
student navigation but remains public and discoverable; do not place private or
instructor-only material in it. Open the known URL, use **Copy HTML**, and paste
the fragment manually into the Canvas Rich Content Editor's HTML view. The
build does not use the Canvas API. After saving, reopen HTML view to inspect
what Canvas retained, compare the text and links with the course-site overview,
and review the saved page at desktop and narrow widths.
`IT230_PUBLIC_ORIGIN` controls the HTTPS origin used for absolute links and
`IT230_SITE_BASE` supplies any deployment subpath.

`pnpm preview` accepts no arguments. It first recreates the complete course-site
production artifact, checks its required files and internal links, and then
serves that exact static artifact on port 4040 without live reload. It cannot
silently display stale or internally inconsistent output. Set
`IT230_SITE_BASE` only when testing a validated project-subpath deployment; the
custom-domain production base is `/`.

## Theme review

Use the theme gallery deck at
`packages/slidev-theme-it230/example.md` while changing shared visual
foundations, layouts, or components. This deck is a visual test fixture: its
slides demonstrate the theme features that course presentations can use rather
than teaching course content.

```sh
pnpm run dev:theme
pnpm run review:theme
pnpm run build:theme
pnpm run capture:theme
pnpm run export:theme
```

The root `review:theme` and `capture:theme` commands delegate to narrowly
scoped scripts in the theme package.
[`review-theme.mjs`](../packages/slidev-theme-it230/scripts/review-theme.mjs)
starts the theme gallery deck on the fixed `localhost:2121` address and
accepts no arguments. Vite strict-port configuration makes the command fail if
2121 is occupied instead of silently selecting another port.
[`capture-theme.mjs`](../packages/slidev-theme-it230/scripts/capture-theme.mjs)
deletes the previous `dist/gallery-png` directory and exports fresh PNG
images of the same deck. With no argument it captures every slide; with one
validated range such as `1,4-7`, it captures only those slides. It rejects
other Slidev arguments so the command cannot select a different source or
output location.

Local development and agent review use separate reserved ports:

| Purpose                           | Command                 | Port |
| --------------------------------- | ----------------------- | ---: |
| Maintainer-run theme development  | `pnpm run dev:theme`    | 2020 |
| Agent-run theme review            | `pnpm run review:theme` | 2121 |
| Maintainer-run course development | `pnpm dev`              | 3030 |
| Agent-run course review           | `pnpm run review`       | 3131 |
| Exact production-site preview     | `pnpm preview`          | 4040 |

The fixed assignments are intentional. If a reserved port is occupied, the new
command fails. An agent reports the conflict and does not scan for another
port, stop the existing process, or start another server. After a successful
review, the agent stops only the review process it started.

The AI-assisted review commands use localhost-only mode and do not enable
remote access or tunneling. The project MCP configuration limits the isolated
browser to the theme-review and course-review origins on ports 2121 and 3131.
The repository rules allow the validated `review` wrappers and `pnpm check`
without an additional command prompt; they do not automatically allow
maintainer development, production preview, dependency changes, staging,
publication, or deployment. These permissions remove redundant tool prompts;
they do not expand the authorized task.

Use the visual-validation tools in this order:

1. Inspect the deck structure and selected slide source with the read-only
   Slidev MCP tools.
2. Start `pnpm run review:theme`, then navigate the isolated browser to the
   selected slide on `http://localhost:2121` at 1920x1080.
3. Capture an accessibility snapshot with bounding boxes, a screenshot, and
   console messages. Use computed-style and overflow inspection when layout,
   spacing, visibility, or clipping is in question.
4. Use `pnpm run capture:theme -- <range>` for deterministic closeout or
   multi-slide comparison. Reserve PDF export for PDF-specific behavior.
5. Stop only the review server started for the current review. Leave any
   pre-existing process untouched and report a reserved-port collision.

The production gallery build writes to
`packages/slidev-theme-it230/dist/gallery`; direct PNG review writes to
`packages/slidev-theme-it230/dist/gallery-png`; and PDF export writes to
`packages/slidev-theme-it230/dist/gallery.pdf`. These generated review
artifacts are not committed. Pass one range such as
`pnpm run capture:theme -- 1,4-7` to capture selected slides directly without
creating or converting a PDF. Inspect the optional PDF only for visual export
regressions when PDF behavior is under review.

The complete `pnpm check` command includes the production gallery and course
site builds, including the supplemental PDFs. The explicit `export:pdf`
command remains available for focused PDF review outside production output.

For course changes, review a focused entry on port 3131 at the 1920x1080 Zoom
viewport, then review the landing page, a representative weekly detail page,
and its Canvas-authoring utility at desktop and narrow widths. Inspect source
structure, semantics, reading and focus order, keyboard operation, visible
focus, console output, text alternatives, rendering, reflow, links, overflow,
and color-independent meaning. Confirm that the copied Canvas source matches
the generated fragment. Use `pnpm preview` to review working site links and the
final exact production artifact.

## Accessibility review

Use `docs/accessibility.md` as the repository-wide standard. Before publishing
an applicable change, manually review semantic and reading order, keyboard and
focus behavior, text alternatives, link language, tables, media alternatives,
contrast, and color-independent meaning.

The hosted browser presentation is the primary student-facing slide format.
Review it at the desktop viewport used for Zoom screen sharing, and review the
course site as a separate artifact. The supported Slidev exporter produces
untagged PDFs. Production publishes them only as supplemental downloads beside
the primary browser presentations; do not describe the PDFs as accessible.

## Publication gates

Before pushing, confirm that:

- Commands, output, links, notes, and exercises are accurate.
- Presentation structure and the computed metadata catalog are valid.
- Slides and terminal content remain readable through Zoom screen sharing.
- Applicable accessibility review has passed for each student-facing format.
- No student information, secrets, solutions, restricted curriculum source,
  or unapproved assets are present.
- Third-party material has a known publication basis and required attribution.
- The theme gallery, every published presentation, and the course site build.
- `dist/` contains only intended public output.

The workflow in `.github/workflows/validate.yml` repeats a frozen install and
`pnpm check` for pushes to `main`, pull-request changes targeting `main`, and
manual runs. Pull-request runs use read-only repository contents and stop after
validation. Conditions on the Pages configuration and artifact-upload steps,
plus a separate condition on the deployment job, restrict all publication work
to `refs/heads/main`. All actions are pinned to reviewed commit SHAs. Automated
validation does not replace the manual review gates above.

## Deployment

Successful `main` validation configures GitHub Pages and uploads only the
reviewed root `dist/` artifact. The dependent deployment job targets the
`github-pages` environment and receives only `pages: write` and
`id-token: write`; it cannot run when validation fails. Successful pushes to
`main` publish automatically at
`https://it230.systemsmetanow.tech` with HTTPS enforcement enabled.

The `workflow_dispatch` trigger provides recovery without a content-only
commit. Run it against `main` to repeat the same frozen installation,
validation, Pages artifact, and dependent deployment for the current reviewed
commit. It does not provide an input for selecting an arbitrary historical
commit.

After deployment, verify the landing page, every changed weekly detail page and
presentation, linked downloads, and a representative nested hash route in
production.

## Corrections

Use a roll-forward workflow. If production is faulty, make the smallest
appropriate correction locally, run the complete validation workflow, commit
the correction, and push the new commit to `main`. When the reviewed content is
already correct, manually run the publication workflow against `main` to
rebuild and redeploy the current commit through the same gates.
