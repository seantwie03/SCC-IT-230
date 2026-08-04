# IT-230: Linux Administration

This repository contains independently maintained course materials used for
IT-230: Linux Administration at St. Charles Community College. The course
builds on introductory Linux skills and develops practical system
administration skills associated with the Red Hat Certified System
Administrator learning path.

Published course materials are available at
[it230.systemsmeta.tech](https://it230.systemsmeta.tech).

## Course materials

As each topic is published, the repository may provide:

- Slide presentations and their source Markdown
- Command-line demonstration scripts
- In-class exercises
- Presenter notes that are safe for public reading
- Original diagrams, media, and student downloads

The course site lists only material that is ready for use. Repository source
is available for readers who want to study, adapt, or help identify a problem
in the material.

## Repository organization

- `course/` contains weekly presentation entries and reusable chapter or topic
  material.
- `packages/slidev-theme-it230/` contains the shared Slidev theme, its focused
  gallery, and theme-specific validation.
- `site/` contains the course landing-page HTML template, its build-time
  renderer, and its stylesheet.
- `docs/` explains the project architecture, course-authoring conventions, and
  publishing workflow.
- `scripts/` supports repository-wide validation and publication.

The root project provides the authoritative development, validation, and build
commands. See [the publishing guide](docs/publishing.md) for the normal local
workflow.

Common root commands are:

```sh
pnpm dev
pnpm build
pnpm preview
pnpm check
```

`pnpm dev` serves the registry-driven landing page on localhost port 3030 and
reloads the browser when the registry, landing-page template, renderer, or
stylesheet changes. It does not start registered presentations. Presentations
are added to the site through the `presentations` array in
`slides.config.mjs`. The `pnpm build` command validates that array, builds
every registered presentation, and generates the corresponding landing-page
links. A Markdown deck that is not registered does not appear on the site.

For focused authoring, pass one validated Markdown entry beneath `course/`. For
example, this command runs only the Week 1 slides with hot reload on localhost:

```sh
pnpm dev -- course/w01.md
```

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
