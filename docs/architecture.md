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
package-specific validation. Its central named-accent resolver consumes the
deck-level `themeConfig.it230Accent` value, and its deck validator rejects
unsupported names before build or publication. The gallery is public theme
source and validation input, but it is not a student-facing course week.

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
- `site/` contains the student-facing course-index HTML template, its
  build-time renderer, and its stylesheet.
- `scripts/` contains deterministic repository-wide operations.
- `docs/` contains enduring maintainer documentation.

## Presentation registry

`slides.config.mjs` is the public registry of presentations. It supplies the
metadata used by development commands, production builds, validation, and the
course site. A presentation is not published merely because a Markdown file
exists; it must have a valid registry entry. The production registry remains
empty until the first course presentation is reviewed for publication.

Every presentation entry contains exactly `id`, `title`, `summary`, `entry`,
and `topics`. Week IDs use `w01` through `w16`; durable topic IDs use an
`it230-`, `rh124-`, or `rh134-` prefix. The build derives the canonical route
from the ID as a domain-relative directory, such as `/w01/`. The entry is an
existing Markdown file beneath `course/` whose headmatter selects `theme: it230` and
`routerMode: hash`. Deck accent stays authoritative in headmatter and is
validated by the theme package rather than duplicated in the registry. There
is no `published` flag: presence in this registry is the publication decision.

The registry also owns the explicit public-resource allowlist. Each resource
has `id`, `title`, `summary`, `source`, `path`, and `publicationBasis`. Its
source must be an existing file inside the repository, and its destination is
a canonical file route beneath `/resources/`. Standard Slidev PDFs are rejected
because the supported exporter does not create the tagged document required by
the repository accessibility standard. Ordinary deck assets remain owned and
processed by their Slidev source rather than being copied through this list.

Registry validation happens before generated output is removed. It rejects
unknown fields, duplicate IDs or resource routes, invalid identifiers, missing
or escaping inputs, invalid deck configuration, unsafe resource destinations,
and output paths outside the intended generated root.

## Build boundary

Production output is assembled in `dist/`. Each production build recreates
dist/ from scratch, builds every presentation listed in `slides.config.mjs`,
generates the course landing page, and copies only allowlisted public
resources. Each deck receives an explicit base, output directory, and
`--without-notes` option. Assets referenced by deck sources are processed by
Slidev. Generated output is not committed.

The landing page uses `site/index.html` as its static document template.
`site/render-template.mjs` loads that template during a production build or
landing-page development, escapes registry text, and replaces the materials
placeholder with sections derived from the validated registry. Production
browsers receive the resulting static HTML and do not execute landing-page
rendering code. The development server watches the registry, template,
renderer, and stylesheet and injects only the small event-stream client needed
to reload the browser after a valid change. It starts no Slidev processes.

`IT230_SITE_BASE` is the single deployment-base input. It defaults to `/` and
also accepts a canonical project subpath such as `/SCC-IT-230/`. Presentation
routes are derived from IDs, and resource paths remain stable domain-relative
paths. The build combines them with the site base when it generates links and
invokes Slidev. Production uses `/` once the custom domain is configured.

The root commands divide development and production responsibilities:

- `pnpm dev` and `pnpm run review` accept either no argument for the
  live-reloading registry landing page or one validated Markdown entry beneath
  `course/` for one focused Slidev server. They do not change `dist/`, and the
  focused entry need not be registered.
- `pnpm build` generates the theme gallery and recreates the complete
  course-site production artifact. `pnpm run build:theme` and
  `pnpm run build:site` retain those focused operations.
- `pnpm run build:deck -- <id>` and `pnpm run export:pdf -- <id>` resolve one
  published deck through the registry and reject arbitrary paths.
- `pnpm preview` recreates and checks the complete course-site production
  artifact before serving it without live reload.
- `pnpm run check:links` checks required generated files and internal HTML and
  CSS references without depending on external network availability.

The focused theme gallery is generated inside
`packages/slidev-theme-it230/dist/`. Root presentation and site builds use the
repository-level `dist/`; each workspace package keeps its generated review
artifacts within its own boundary.

Stable presentation routes use week or topic identifiers without semester or
implementation details. The site and presentations must work with the base
path used by GitHub Pages and with the configured custom domain.

## Validation fixtures and automation

The synthetic presentation beneath `tests/fixtures/course/` and the fixture
registry and resource beneath `tests/fixtures/site/` are test inputs only. The
fixture consumes the local theme, imports a named fragment, uses a local asset
and named accent, and contains a presenter note so the integration test
exercises the multi-deck pipeline. It never appears in the production registry
or production landing page.

`pnpm check` is the non-server proof of the production boundary. It checks
formatting and the supported toolchain, runs theme and site tests, runs the
aggregate production build, and checks generated links. The validation-only
GitHub Actions workflow runs the same command after a frozen root install on
each push to `main`. It has read-only repository permission and no deployment,
Pages, artifact-upload, or identity-token authority.
