# IT-230: Linux Administration

This repository contains independently maintained course materials used for
IT-230: Linux Administration at St. Charles Community College. The course
builds on introductory Linux skills to develop practical system
administration skills associated with the Red Hat Certified System
Administrator learning path.

Published course materials are available at
[it230.systemsmetanow.tech](https://it230.systemsmetanow.tech).

GitHub Actions validates pushes to `main` and pull-request changes targeting
`main`. Commits to `main` publish the `dist/` artifact to the course site after
a successful validation. The same workflow can be run manually on `main` to
rebuild and redeploy the current reviewed commit.

## Course materials

As each topic is published, the repository may provide:

- A custom `it230` Slidev theme
- Slide presentations and their source Markdown
- Command-line exercise scripts and html files
- Presenter notes that are safe for public reading
- Original diagrams, media, and student downloads
- PDF exports of the slide presentations

The course site lists only material that is ready for use. Repository source
is available for readers who want to study, adapt, or help identify a problem
in the material.

## Repository organization

- `course/` contains weekly presentation entries and reusable chapter or topic
  material.
- `packages/slidev-theme-it230/` contains the shared Slidev theme, its focused
  gallery, and theme-specific validation.
- `site/` contains the landing, weekly-detail, and Canvas-authoring HTML
  templates, the build-time site and Canvas renderers, and the stylesheet.
- `docs/` explains the project architecture, course-authoring conventions, and
  publishing workflow.
- `scripts/` supports repository-wide validation and publication.

The root project provides the authoritative development, validation, and build
commands. See [the publishing guide](docs/publishing.md) for the normal local
workflow.

Common commands are:

```sh
pnpm dev
pnpm check
pnpm build
pnpm preview
```

`pnpm dev` serves the metadata-driven course site on localhost port 3030 and
reloads the browser when a published week, imported topic, exercise, template,
renderer, or stylesheet changes. The landing page lists each published week's
title and summary; its detail page contains the complete weekly overview. A
root-level `course/w01.md` through `course/w16.md` file is a published week; a
noncanonical name such as `course/w02-draft.md` remains available for focused
review without appearing on the site. The `pnpm build` command discovers and
validates every published week, builds its presentation, exports its
supplemental `SCC-IT-230-<id>.pdf`, renders its topic-declared HTML exercises
in the week's accent, and generates the corresponding weekly overview. A week
is published at `/weeks/<id>/`, its slides at `/weeks/<id>/slides/`, and its
PDF and exercises beneath `/weeks/<id>/resources/`.

For focused authoring, pass one validated Markdown entry beneath `course/`. For
example, this command runs only the Week 1 slides with hot reload on localhost:

```sh
pnpm dev -- course/w01.md
```

Topic frontmatter supplies the meeting agenda, curriculum references, named
slide routes, and exercises. Each production build also publishes an unlinked
Canvas-authoring utility at `/weeks/<id>/canvas/`. It displays the Canvas-safe
weekly fragment as copyable HTML source; the utility is public even though it
does not appear in student navigation.

## Licensing

Original educational content is available under the
[Creative Commons Attribution 4.0 International License](LICENSE-CONTENT.md).
Code, configuration, scripts, and theme implementation are available under
the [MIT License](LICENSE-CODE.md). See [NOTICE.md](NOTICE.md) for the license
scope, third-party exclusions, and attribution information.

## Independent maintenance

This repository contains independently maintained course materials used for
IT-230: Linux Administration at St. Charles Community College. St. Charles
Community College does not operate or endorse this repository.

References to Red Hat products, certifications, or courses identify the
technologies and curriculum context. Red Hat does not operate or endorse this
repository.
