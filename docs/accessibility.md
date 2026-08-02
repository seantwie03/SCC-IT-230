# Accessibility

## Repository standard

This repository adopts Web Content Accessibility Guidelines (WCAG) 2.1 Level
AA as its minimum accessibility target for web-delivered presentations,
course-site content, and generated course documents. Apply the target to both
source decisions and the artifacts students use.

WCAG conformance is a technical baseline, not a complete guarantee of equitable
access. Authoring and publication review must also consider classroom
projection, reading and focus order, assistive-technology use, effective
communication, and individual accommodation needs.

Do not describe an artifact as accessible merely because it builds, passes an
automated check, or meets color-contrast thresholds.

## Institutional and federal context

[Accessibility at SCC](https://www.stchas.edu/learning-student-support/accessibility-at-scc.php)
states the college's commitment to reasonable access under the Americans with
Disabilities Act, Section 504 of the Rehabilitation Act, and other applicable
requirements. SCC also maintains an
[Accessibility and OER LibGuide](https://libguides.stchas.edu/oer/accessibility)
with practical resources for accessible educational materials, including WCAG
guidance.

The Department of Justice's
[Title II web and mobile-app accessibility fact sheet](https://www.ada.gov/resources/2024-03-08-web-rule/)
identifies public community colleges as covered public entities and WCAG 2.1
Level AA as the technical standard for covered web content and mobile apps. The
rule has defined scope, exceptions, compliance dates, and obligations beyond
technical conformance. Consult the current official sources when making a
legal or institutional-policy determination; this repository document does not
replace them or provide legal advice.

The repository uses WCAG 2.1 Level AA as its minimum acceptance target even
when a particular artifact's legal classification or deadline has not been
determined.

## Shared requirements

- Preserve a logical semantic structure and reading order in source, rendered
  slides, the course site, and standalone documents.
- Make all functionality keyboard operable and keep focus order and focus
  indicators visible and meaningful.
- Provide useful text alternatives for informative images and equivalent text
  explanations for complex diagrams, charts, and other visual instruction.
- Provide captions for prerecorded instructional video and an appropriate text
  alternative for instructional audio.
- Use descriptive link text and proper headings, lists, and tables rather than
  visual formatting alone.
- Meet applicable WCAG AA contrast requirements and never use color as the only
  carrier of meaning.
- Keep text, code, terminal output, controls, and meaningful graphics readable
  without overcrowding or relying on unusually fine detail.
- Dynamic code or terminal highlighting may intentionally dim lines that are
  nonessential to the current teaching step. Give each important line a
  full-contrast stage, and provide an all-lines stage when comparison of the
  complete example is instructionally necessary.
- Preserve the same instructional information when content is delivered in
  more than one format.

The hosted browser presentation is the primary student-facing slide format and
must pass the applicable accessibility review. The standard Slidev PDF exporter
in the supported toolchain produces untagged PDFs. Selectable text and visual
similarity to the browser presentation do not make an untagged PDF accessible.

## Responsibility boundaries

- `docs/design-system.md` owns accessible theme tokens, typography, focus
  treatment, layouts, components, and visual-state behavior.
- `docs/course-authoring.md` owns semantic content structure, reading order,
  text alternatives, link language, tables, and media alternatives.
- `docs/publishing.md` owns the accessibility review required before a change
  is committed, pushed, or deployed.
- `docs/architecture.md` owns any automated accessibility tooling or build
  boundary added to the project.

When an accessibility failure crosses these boundaries, correct the underlying
theme, content, or pipeline instead of documenting a one-off workaround.

## Validation

Use automated checks where they can evaluate deterministic criteria, but keep
manual review as a required gate. For each applicable change:

1. Inspect semantic and reading order.
2. Navigate interactive output with the keyboard and verify visible focus.
3. Review text alternatives, links, tables, and media alternatives.
4. Check contrast and color-independent meaning.
5. Inspect representative browser and classroom-projection rendering.

Record and resolve failures before publication. If a criterion cannot yet be
reliably validated, document the limitation without treating it as a pass.
