# Bundled fonts

The theme self-hosts its typefaces so that a deck renders identically wherever
it is measured or read: the authoring machine, CI, the exported PDF, and a
student's browser. Relying on system fonts made line breaking depend on which
families happened to be installed, so a slide could fit locally and overflow in
CI or for a student. See `docs/design-system.md` for the contract.

Both families are licensed under the SIL Open Font License, Version 1.1, which
permits redistribution and embedding provided the copyright notice and license
accompany the files. Both are bundled unmodified, so the OFL Reserved Font Name
restriction on modified versions does not apply.

## Lato

- Copyright (c) 2010-2014 tyPoland Lukasz Dziedzic, Reserved Font Name "Lato"
- Version 25 (`v25`), as served by the Google Fonts CDN
- Source: `https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900`
- License: `Lato-OFL.txt`, from `https://github.com/google/fonts/blob/main/ofl/lato/OFL.txt`
- Weights 300, 400, 700, and 900, each split into the `latin` and `latin-ext`
  subsets Google publishes. The `unicode-range` descriptors are preserved, so a
  browser downloads only the subset a slide actually needs.

## Cascadia Mono

- Copyright (c) 2019-present Microsoft Corporation, Reserved Font Name "Cascadia Code"
- Version 2407.24
- Source: `https://github.com/microsoft/cascadia-code/releases/tag/v2407.24`,
  `woff2/CascadiaMono.woff2`
- License: `CascadiaMono-OFL.txt`, from the repository at tag `v2407.24`
- The Mono variant is bundled rather than Cascadia Code because the theme
  disables ligatures. It is a variable font covering weights 200-700 in one
  file, which is smaller than shipping the separate static weights the theme
  uses for code, bold tokens, and terminal prompts.

## Updating

Replace the files, update the versions above, then run `pnpm check`. Metrics
change when a font version changes, so review `check:slides -- --all` output
rather than assuming existing slides still fit.
