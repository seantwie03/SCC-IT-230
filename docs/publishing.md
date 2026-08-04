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
pnpm build
pnpm run build:site
pnpm run build:deck -- w01
pnpm preview
```

With no argument, `dev` and `review` serve only the registry-driven landing
page. They reload the browser after a valid change to the registry,
landing-page template, renderer, or stylesheet and do not start Slidev. With
exactly one argument, they start one Slidev development server for that
validated Markdown entry beneath `course/`, whether or not it is already
registered. Focused review does not publish the entry, add it to the landing
page, or change `dist/`.

Production operations are registry-driven. `pnpm build` generates the theme
gallery and then runs `build:site`, which validates the complete registry,
recreates `dist/`, generates the landing page, copies allowlisted resources,
and builds each registered deck without presenter notes. The `build:theme` and
`build:site` commands retain those focused build operations. `build:deck`
accepts one registered ID for a focused production build. `export:pdf` also
accepts one registered ID, but its PDF is an optional review artifact under
`exports/`, not student-facing production output.

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

The complete `pnpm check` command includes the production gallery build. PDF
export remains an explicit, optional visual-review command rather than part of
the standard validation path or a student publication target.

For course changes, review a focused entry on port 3131 at the 1920x1080 Zoom
viewport, then review the landing page at desktop and narrow widths. Inspect
source structure, semantics, reading and focus order, keyboard operation,
visible focus, console output, text alternatives, rendering, reflow, links,
overflow, and color-independent meaning. Use `pnpm preview` to review working
landing-page links and the final exact production artifact.

## Accessibility review

Use `docs/accessibility.md` as the repository-wide standard. Before publishing
an applicable change, manually review semantic and reading order, keyboard and
focus behavior, text alternatives, link language, tables, media alternatives,
contrast, and color-independent meaning.

The hosted browser presentation is the primary student-facing slide format.
Review it at the desktop viewport used for Zoom screen sharing, and review the
course site as a separate artifact. The supported Slidev exporter produces
untagged PDFs, so standard PDF exports must not be included in published course
output or described as accessible. If a future requirement calls for PDFs,
remediate and validate them through a separate document-accessibility workflow
before publication.

## Publication gates

Before pushing, confirm that:

- Commands, output, links, notes, demonstrations, and exercises are accurate.
- Presentation structure and the registry are valid.
- Slides and terminal content remain readable through Zoom screen sharing.
- Applicable accessibility review has passed for each student-facing format.
- No student information, secrets, solutions, restricted curriculum source,
  or unapproved assets are present.
- Third-party material has a known publication basis and required attribution.
- The theme gallery, every registered presentation, and the course site build.
- `dist/` contains only intended public output.

The validation-only workflow in `.github/workflows/validate.yml` repeats a
frozen install and `pnpm check` on every push to `main`. Its actions are pinned
to reviewed commit SHAs, and its only repository permission is read-only
repository contents. It does not deploy, upload a Pages artifact, request an
identity token, or establish that the course site is live. Automated validation
does not replace the manual review gates above.

## Deployment

Deployment is not implemented in Phase 5. A later phase will configure GitHub
Pages and the `it230.systemsmeta.tech` custom domain. That deployment workflow
must depend on successful validation and upload only the reviewed root `dist/`
artifact.

After deployment is implemented, verify the landing page, every changed
presentation, linked downloads, and a representative nested hash route in
production.

## Corrections

Use a roll-forward workflow. If production is faulty, make the smallest
appropriate correction locally, run the complete validation workflow, commit
the correction, and push the new commit to `main`. A future deployment workflow
may provide a manual redeploy of a known commit when the content itself does not
require a change.
