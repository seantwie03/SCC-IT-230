# Architecture

## Project boundary

IT-230 is one root Node.js project with one pnpm lockfile. The root project
exposes repository-wide commands and owns dependency versions, validation,
production builds, and the course site. Workspace packages own package-specific
command implementations invoked by the root. Individual weeks and chapters do
not install their own toolchains.

The local Slidev theme is a workspace package at
`packages/slidev-theme-it230`. Keeping the theme in the repository allows
presentations and theme changes to be validated together.

## Toolchain contract

The project supports the Node.js 24 major line. `package.json` is the
authoritative runtime declaration, and `.nvmrc` is a convenience for local
version managers. The exact pnpm release is declared by `packageManager` in
`package.json`.

AI-assisted visual review uses Playwright MCP with the locally installed Google
Chrome channel. Google Chrome is therefore a system-level development
prerequisite and is verified by `pnpm run check:toolchain`; its release is not
managed by the repository lockfile. Slidev PDF and PNG export continue to use
the separately pinned `playwright-chromium` package.

Application dependencies use exact versions in the root manifest and are
resolved by the single root `pnpm-lock.yaml`. Install dependencies from the
repository root with `pnpm install --frozen-lockfile` so installation does not
silently change the reviewed dependency graph.

The repository-scoped Slidev skill lives at `.agents/skills/slidev/`. It is
copied from the skill bundled with the pinned `@slidev/cli` release and must be
refreshed whenever the pinned Slidev dependencies are updated.

`pnpm-workspace.yaml` registers packages under `packages/`. Workspace packages
share the root dependency installation and lockfile; they do not own separate
lockfiles or `node_modules` directories.

## Theme workspace

`packages/slidev-theme-it230/` is a private local workspace package consumed by
the root project. It owns shared visual tokens, global slide styles, layouts,
components, Shiki configuration and custom languages, its focused gallery, and
package-specific validation. The gallery is public theme source and validation
input, but it is not a student-facing course week.

The theme package must not create a nested dependency installation or lockfile.
Its generated gallery review artifacts belong under its own `dist/` directory
and are not committed.

## Main areas

- `course/` contains weekly composition files and canonical chapter/topic
  content.
- `.agents/skills/` contains repository-scoped agent skills that apply to the
  project.
- `packages/slidev-theme-it230/` contains shared presentation styling,
  layouts, components, its focused gallery, and theme-specific validation.
- `site/` contains the student-facing course index.
- `scripts/` contains deterministic repository-wide operations.
- `docs/` contains enduring maintainer documentation.

## Presentation registry

`slides.config.mjs` is the public registry of presentations. It supplies the
metadata used by development commands, production builds, validation, and the
course site. A presentation is not published merely because a Markdown file
exists; it must have a valid registry entry.

## Build boundary

Production output is assembled in `dist/`. Each production build recreates
dist/ from scratch, builds every presentation listed in `slides.config.mjs`,
and generates the course landing page. Assets referenced by those sources are
processed by the presentation and site build tools. Generated output is not
committed.

The focused theme gallery is generated inside
`packages/slidev-theme-it230/dist/`. Root presentation and site builds use the
repository-level `dist/`; each workspace package keeps its generated review
artifacts within its own boundary.

Stable presentation routes use week or topic identifiers without semester or
implementation details. The site and presentations must work with the base
path used by GitHub Pages and with the configured custom domain.
