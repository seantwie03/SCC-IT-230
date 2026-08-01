# Architecture

## Project boundary

IT-230 is one root Node.js project with one pnpm lockfile. The root project
owns development commands, dependency versions, validation, production builds,
and the course site. Individual weeks and chapters do not install their own
toolchains.

The local Slidev theme is a workspace package at
`packages/slidev-theme-it230`. Keeping the theme in the repository allows
presentations and theme changes to be validated together.

## Toolchain contract

The project supports the Node.js 24 major line. `package.json` is the
authoritative runtime declaration, and `.nvmrc` is a convenience for local
version managers. The exact pnpm release is declared by `packageManager` in
`package.json`.

Application dependencies use exact versions in the root manifest and are
resolved by the single root `pnpm-lock.yaml`. Install dependencies from the
repository root with `pnpm install --frozen-lockfile`. Run current validation
with `pnpm check`; use `pnpm format` to apply formatting to the file types
currently covered by the formatter.

`pnpm-workspace.yaml` registers packages under `packages/`. Workspace packages
share the root dependency installation and lockfile; they do not own separate
lockfiles or `node_modules` directories.

## Main areas

- `course/` contains weekly composition files and canonical chapter/topic
  content.
- `packages/slidev-theme-it230/` contains shared presentation styling,
  layouts, components, and its focused gallery.
- `site/` contains the student-facing course index.
- `scripts/` contains deterministic repository operations.
- `tests/` contains structural and behavioral checks.
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
processed by the presentation and site build tools. Generated output is not committed.

Stable presentation routes use week or topic identifiers without semester or
implementation details. The site and presentations must work with the base
path used by GitHub Pages and with the configured custom domain.
