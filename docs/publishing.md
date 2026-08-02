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

| Purpose                             | Command                 | Port |
| ----------------------------------- | ----------------------- | ---: |
| Maintainer-run theme development    | `pnpm run dev:theme`    | 2020 |
| Agent-run theme review              | `pnpm run review:theme` | 2121 |
| Future maintainer-run course site   | `pnpm dev`              | 3030 |
| Future agent-run course-site review | Not yet implemented     | 3131 |

The fixed assignments are intentional. If a reserved port is occupied, the new
command fails. An agent reports the conflict and does not scan for another
port, stop the existing process, or start another server. After a successful
review, the agent stops only the `review:theme` process it started.

The AI-assisted review command uses Slidev local mode and does not enable
remote access or tunneling. The project MCP configuration allows the isolated
browser to request only the theme-review origin on port 2121. Review the
gallery at the 1920x1080 desktop viewport used for Zoom screen sharing. All
Slidev MCP tools are preapproved because they operate on the same deck Markdown
that an authorized repository task can edit directly. This removes a redundant
tool-specific prompt; it does not expand the task's scope, bypass repository
guidance, stage changes, or authorize publication.

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

## Deployment

GitHub Actions repeats deterministic validation on every push to `main` and
deploys only after validation succeeds. The deployment job uploads only
`dist/` to GitHub Pages. The production site uses
<https://it230.systemsmeta.tech>.

After deployment, verify the landing page, every changed presentation, linked
downloads, and a representative nested hash route in production.

## Corrections

Use a roll-forward workflow. If production is faulty, make the smallest
appropriate correction locally, run the complete validation workflow, commit
the correction, and push the new commit to `main`. The manual workflow trigger
may redeploy a known commit when the content itself does not require a change.
