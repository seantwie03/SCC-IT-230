# Repository Guidance

## Repository rules

- Treat every committed file, Git revision, generated artifact, and workflow
  log as public. Presenter notes are public source even when production output
  omits them.
- Preserve the technical meaning of commands, output, learning objectives,
  demonstrations, exercises, and presenter notes.
- Do not add student information, assessment solutions, instructor-only
  material, restricted curriculum material, or an asset whose publication
  rights are unclear. Do not add credentials or other confidential values to
  demos, scripts, exercises, documentation, or configuration. A credential or
  contact detail that already appeared in a previously used course slide deck
  may be ported into slide content as-is; this narrow allowance covers only
  slide content, not other repository material.
- Use text references only for St. Charles Community College and Red Hat. Do
  not add their logos, branded artwork, or visual identity elements without
  explicit authorization.
- Work directly on `main`; do not create feature branches or pull requests.
- Keep prospective changes unstaged during the instructor's manual review.
  Stage files only after the instructor explicitly approves the review.
- Install dependencies from the repository root with
  `pnpm install --frozen-lockfile`; do not create nested installations.
- When updating the pinned Slidev dependencies, refresh
  `.agents/skills/slidev/` from the matching `@slidev/cli` release and verify
  that Slidev still preserves the custom `courseInfo` and `topicInfo`
  frontmatter used by the publishing pipeline.
- This repository is worked on with Codex, Claude Code, and Google
  Antigravity. Their configurations mirror each other: `.mcp.json`
  (shared with Antigravity via `.agents/mcp_config.json`) and
  `.codex/config.toml` both define the MCP servers; `.codex/rules/default.rules`,
  `.claude/settings.json`, and `.agents/settings.json` define which commands
  run without an approval prompt; skills live in `.agents/skills/` for all
  tools, but Claude Code only discovers a skill if `.claude/skills/<name>`
  exists as a symlink to it (e.g. `.claude/skills/slidev -> ../../.agents/skills/slidev`).
  When you add, remove, or change an MCP server, a command-approval rule, a
  tool permission, or a skill under `.agents/skills/`, make the equivalent
  change (including adding or removing its `.claude/skills/` symlink) for all
  harnesses in the same commit — do not let them drift ahead of each other.
- Before running a command, consult `.codex/rules/default.rules` (Codex),
  `.claude/settings.json` (Claude Code), or `.agents/settings.json`
  (Antigravity) and prefer an approved equivalent command form when one exists.
- Run the current validation suite with `pnpm check`.
- Run the relevant local validation before committing and pushing.
- Treat the existence of a canonical `course/w01.md` through `course/w16.md`
  file as publication approval. Keep incomplete weeks in noncanonical files
  such as `course/w02-draft.md`; do not add a publication flag.
- Treat WCAG 2.1 Level AA as the minimum accessibility target. Do not claim an
  artifact is accessible based only on a successful build, automated check, or
  contrast measurement.
- Treat mobile viewing of the course site and slide decks as a secondary
  compatibility requirement: both must remain functional and viewable on narrow
  screens. Design slide content, layout, and information density for the intended
  presentation viewport, not for mobile optimization.

For an authorized weekly course-preparation task, consult the instructor’s
private source repository only as a read-only reference. Follow its root guidance
and use only material explicitly approved for public release.

## Required guidance

Read the relevant document before changing files in its area:

| Work                                                                                       | Required document          |
| ------------------------------------------------------------------------------------------ | -------------------------- |
| Slides, presenter notes, demonstrations, exercises, topic assets, or other course material | `docs/course-authoring.md` |
| Project structure, workspace boundaries, presentation catalog, routes, or build output     | `docs/architecture.md`     |
| Theme tokens, global styles, layouts, shared components, or the theme gallery              | `docs/design-system.md`    |
| Accessibility standards, audits, remediation, or cross-cutting accessibility work          | `docs/accessibility.md`    |
| Staging, committing, pushing, deployment, publication checks, or production corrections    | `docs/publishing.md`       |

If a task crosses more than one area, read each applicable document. Update the
authoritative document when its enduring behavior changes rather than copying
its detailed rules into this file.
