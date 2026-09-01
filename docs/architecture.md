# Architecture

## Project boundary

SCC-IT-230 is one root Node.js project with one pnpm lockfile. The root project
exposes repository-wide commands and owns dependency versions, validation,
production builds, and the course site. Workspace packages own package-specific
command implementations invoked by the root. Individual weeks and chapters do
not install their own toolchains.

The local Slidev theme is a workspace package at
`packages/slidev-theme-it230`. Keeping the theme in the repository allows
presentations and theme changes to be validated together.

## Toolchain contract

The project supports the Node.js 24 release line. `package.json` is the
authoritative runtime declaration, and `.nvmrc` is a convenience for local
version managers. The exact pnpm release is declared by `packageManager` in
`package.json`.

Rendered review commands use the pinned `playwright-chromium` package directly
through `scripts/lib/browser.mjs`, which owns launching the browser and
collecting page diagnostics for both slide and exercise review. `axe-core`
supplies the accessibility rule catalogue those commands evaluate.

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
- `site/` contains the landing, weekly-detail, and Canvas-authoring HTML
  templates, the site and Canvas build-time renderers, and the stylesheet. The
  shared site-and-presentation favicon is owned by the theme package.
- `scripts/` contains deterministic repository-wide operations, including the
  rendered review commands and the lab-access wrapper.
- `docs/` contains enduring maintainer documentation.

## Rendered review

Building a deck proves it compiles, not that it reads. Two commands render the
published artifacts and measure them.

`check-slides.mjs` drives a Slidev development server for one entry, walks every
slide and every click state through `window.__slidev__.nav`, and compares each
visible element against the layout's computed content box. The content box is
the boundary rather than the slide edge because the theme reserves its bottom
padding for the footer, so content that reaches into that band collides with the
footer while still sitting inside the slide. Measurements are converted to
canvas pixels, so a threshold means the same thing at any viewport. Decorative
elements, code line-number gutters, hidden click states, and content inside a
scrolling ancestor are excluded. The command also fails on page errors and on
console messages that indicate broken rendering, because a failed Mermaid
diagram reports a warning rather than an error and would otherwise ship blank.

Its `--verbose` output adds two measurements that are useful while authoring
rather than as pass or fail conditions: each slide's remaining clearance, and
the height of every terminal frame. A terminal whose height changes between
click states moves the surrounding block on every click, so a constant number
across states is the signal that `TerminalWindow`'s `rows` reservation is doing
its job.

`check-exercises.mjs` loads each declared exercise document, runs `axe-core`
against the WCAG 2.1 A and AA rules, verifies this repository's document
contract, and checks reflow at 320 and 1920 CSS pixels. Reflow is checked in two
ways because the exercise surface hides its overflow: content wider than the
viewport either scrolls the page or is silently clipped by an ancestor, and only
the first is visible to a scroll-width measurement.

Both commands accept one `course/` entry or `--all`, and both run inside
`pnpm check`.

## Presentation discovery and catalog

A root-level file named `course/w01.md` through `course/w16.md` is a published
week. Discovery is nonrecursive and matches only that canonical form;
`course/w02-draft.md` and Markdown beneath `course/chapters/` remain
unpublished. The week ID is derived from the filename and supplies the stable
`/weeks/<id>/` overview route. Its presentation, resources, and Canvas
authoring utility are siblings at `/weeks/<id>/slides/`,
`/weeks/<id>/resources/`, and `/weeks/<id>/canvas/`. Renaming a reviewed draft
to its canonical filename is the publication decision, and removing that
canonical file unpublishes it on the next complete build.

Canonical discovery is the production path, but a draft resolves through the
same code: `validatePresentationEntry` loads any entry under an explicit week
ID, which `entryWeekId` derives from the filename (`w03.md` and the documented
`w03-draft.md` convention both resolve to `w03`). This lets a draft's topic
metadata, route aliases, curriculum alignments, and declared exercises be
validated against the identity they will publish under, so renaming a reviewed
draft is never the first time those errors appear. Deck-level headmatter
validation stays separate and lighter, so `pnpm dev` and `pnpm run review`
remain usable on an incomplete draft that has no title or summary yet.

`scripts/lib/presentations.mjs` uses Slidev's parser to resolve imports in
presentation order, validates custom metadata, and produces one frozen computed
catalog for builds, rendering, link checking, exports, and development. Parser
errors are fatal so a missing, circular, ranged, or escaping import cannot
silently remove course content. The catalog retains every resolved Markdown
source for live reload. Catalog construction also reads and validates every
declared exercise document, including its required closing `head` tag. All of
this validation and the static HTML rendering preflight happen before generated
output is removed.

Week title, summary, and accent come from the canonical deck headmatter. Agenda
topics, stable section aliases, curriculum alignments, and exercise declarations
come from `topicInfo` on resolved topic slides. Curriculum identities are
de-duplicated for the weekly overview while the agenda remains in resolved
presentation order.

Canonical exercise source files are owned by their topic and can be reused by
multiple weeks. Each generated copy and public URL is week-owned: HTML
exercises and the supplemental PDF publish beneath
`/weeks/<id>/resources/`. Ordinary deck assets remain processed by Slidev
beneath `/weeks/<id>/slides/assets/` so the two namespaces do not collide.
Production builds render, rather than byte-copy, each week-owned exercise and
inject the three resolved accent custom properties from its importing
presentation. The exercise source keeps the global blue accent as its
direct-open fallback, so one canonical exercise may take on different accents
when reused by different weeks. The course-site development server performs the
same rendering at the public resource route.

## Build boundary

Production output is assembled in `dist/`. Each production build discovers and
validates canonical weeks and renders every static artifact in memory before
recreating `dist/`. It then writes the course landing page, a detail page and an
unlinked Canvas-authoring page for every published week, builds every discovered
presentation, exports a supplemental PDF for each deck, and writes its rendered
exercises. The theme's shared SVG favicon is published at `/favicon.svg`; site
pages use deployment-base-aware references and exercises use a relative
reference from their stable resource directory. A theme Vite plugin also serves
it during focused deck development and emits it at each presentation root
without replacing a deck's own public assets. Each deck receives an explicit
base, output directory, and
`--without-notes` option. Its PDF is published as
`/weeks/<id>/resources/SCC-IT-230-<id>.pdf`; declared resources share that
directory. Assets referenced by deck sources are processed by Slidev.
Generated output is not committed.

The compact landing page uses `site/index.html` as its static document
template; each full weekly overview uses `site/week.html`; and each Canvas
source utility uses `site/canvas.html`. One normalized weekly-view builder owns
the shared instructional labels, prose, and destinations. The site and Canvas
renderers consume that model, load their respective templates, and escape its
catalog-derived text. Curriculum pretext appears immediately after its phase
heading and before the associated list. Meeting Agenda pretext instead follows
the presentation actions and directly introduces the topic list. Both surfaces
use this ordering. A
shared artifact generator is used by both production builds and course-site
development so the two paths publish the same artifact types and honor the same
base and public-origin configuration. Week detail
pages place Before class, In class, and After class vertically and link to
adjacent published weeks. Canvas utilities encode the generated fragment inside
a read-only text area so the browser displays source instead of interpreting
it. Production browsers receive the resulting static HTML and do not execute
catalog rendering code.

On every development reload, a short-lived worker loads a fresh module graph
and rebuilds the catalog and artifacts. Workers have a bounded rendering time
and are explicitly terminated after success, failure, timeout, or server
disposal. The server watches canonical week discovery, resolved Markdown
imports, declared exercise sources, and relevant source files beneath
`scripts/lib/`, `site/`, and `packages/slidev-theme-it230/setup/`. Defining
implementation watch roots instead of enumerating individual modules ensures
new rendering dependencies and accent-palette changes participate in reloads.
The server injects only the small event-stream client needed to reload the
browser after a valid change and keeps serving the last valid artifact set
after an invalid edit. It starts no Slidev processes.

`IT230_SITE_BASE` and `IT230_PUBLIC_ORIGIN` are the two deployment inputs.
`IT230_SITE_BASE` defaults to `/` and also accepts a canonical project subpath
such as `/SCC-IT-230/`. Presentation and resource routes are derived from
presentation IDs; the build combines them with the site base when it generates
links and invokes Slidev. Those routes use derived week identifiers without
semester or implementation details, so the site and presentations work with
both the base path used by GitHub Pages and the configured custom domain.
Production uses `/` once the custom domain is configured.

`IT230_PUBLIC_ORIGIN` defaults to `https://it230.systemsmetanow.tech` and must
be an HTTPS origin without credentials, path, query, or fragment. Canvas page
generation combines this origin with `IT230_SITE_BASE` and the same derived
routes used by the site, producing absolute public URLs without embedding
deployment details in instructional metadata. The Canvas renderer independently
rejects destinations that are not absolute credential-free HTTPS URLs, so
callers cannot accidentally weaken this output contract by omitting the public
origin.

The root `package.json` commands divide development and production
responsibilities:

- `pnpm dev` and `pnpm run review` accept either no argument for the
  live-reloading catalog landing page or one validated Markdown entry beneath
  `course/` for one focused Slidev server. They do not change `dist/`, and the
  focused entry need not be a canonical published week.
- `pnpm build` generates the theme gallery and recreates the complete
  course-site production artifact. `pnpm run build:theme` and
  `pnpm run build:site` retain those focused operations.
- `pnpm run build:deck -- <id>` builds one published web deck, its supplemental
  PDF, and its exercises. `pnpm run export:pdf -- <id>` creates a separate
  review PDF under `exports/`; both accept only a canonical published week ID.
- The complete site build generates `/weeks/<id>/canvas/` for every published
  week. This public but unlinked authoring page exposes the Canvas-safe fragment
  as copyable source; no command writes Canvas HTML outside `dist/`, and no
  process sends content to Canvas automatically.
- `pnpm preview` recreates and checks the complete course-site production
  artifact before serving it without live reload.
- `pnpm run check:links` checks required generated files and internal HTML and
  CSS references without depending on external network availability.

The focused theme gallery is generated inside
`packages/slidev-theme-it230/dist/`. Root presentation and site builds use the
repository-level `dist/`; each workspace package keeps its generated review
artifacts within its own boundary.

## Validation fixtures and automation

The synthetic canonical week beneath `tests/fixtures/course/` is test input
only. It consumes the local theme, imports a named fragment, declares a
topic-owned HTML exercise, uses a local asset and named accent, and contains a
presenter note so the integration test exercises the complete pipeline. The
same tree holds a noncanonical `w02-draft.md` that discovery must ignore and
focused review must still accept. The canonical fixture week is discovered only
when the catalog is pointed at the fixture course root, and neither file
appears on the production landing page.

`pnpm check` is the non-server proof of the production boundary. It checks
formatting and the supported toolchain, runs theme and site tests, runs the
aggregate production build, and checks generated links.
`.github/workflows/validate.yml` runs the same command after a frozen root
install for pushes to `main`, pull requests targeting `main`, and manual
dispatch. The workflow grants only `contents: read` by default. Pages
configuration, artifact upload, and the dependent deployment job are each
conditioned on `refs/heads/main`, and only that deployment job receives
`pages: write` and `id-token: write`. `docs/publishing.md` owns the deployment
and correction workflow this automation implements.
