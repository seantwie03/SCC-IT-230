# Accessibility

## Repository standard

This repository adopts [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/) Level
AA as its minimum accessibility target for web-delivered presentations,
course-site content, and student-facing HTML resources. Apply the target to
both source decisions and the primary artifacts students use.

WCAG conformance is a technical baseline, not a complete guarantee of equitable
access. Authoring and publication review must also consider Zoom screen
sharing, reading and focus order, assistive-technology use, effective
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
technical conformance.

The repository uses WCAG 2.1 Level AA as its minimum acceptance target.

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

The course-site detail page and Canvas weekly overview are two renderings of
one normalized content model. They must preserve the same summary, curriculum
references, agenda order, descriptive section links, exercise grouping,
required Canvas lab instruction, and destinations. The course landing page is
intentionally a shorter discovery view containing each week's title and
summary. The three surfaces share one semantic hierarchy of week, then phase,
then agenda topic, but their literal heading levels are offset because each
sits in a different host document and Canvas supplies its page title outside
the pasted fragment. No surface may skip a level. `docs/design-system.md` owns
the level-by-level map; change it there and mirror the result in every
renderer. Agenda topic headings link directly to their opening slides, and
their accessible names identify both the slide destination and new-tab
behavior.
Automated tests compare the ordered `{text, href}` pairs produced by the site
and Canvas renderers after removing the required Canvas origin prefix. This
guards their shared information and destination order, but does not replace
manual review of either rendered result. The Canvas renderer also rejects any
rendered destination that is not an absolute credential-free HTTPS URL.

The hosted browser presentation is the primary student-facing slide format and
must pass the applicable accessibility review. The standard Slidev PDF exporter
in the supported toolchain produces untagged PDFs. Selectable text and visual
similarity to the browser presentation do not make an untagged PDF accessible.
The build may publish that PDF as a supplemental download because the same
course material remains available through the primary browser presentation.
Do not describe the supplemental PDF itself as accessible or treat it as a
replacement for the browser presentation.

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
5. Inspect representative browser rendering at the 1920x1080 desktop viewport
   used for Zoom screen sharing.
6. Inspect the course site at desktop and narrow viewports for meaningful
   reflow, readable text, intact links, and absence of horizontal overflow.
   Use 320 CSS pixels as the narrow width, matching SC 1.4.10.
   Include a representative standalone HTML exercise, verify its ordered-step
   reading sequence, and confirm that the sticky course links and bottom
   week-overview return link remain keyboard operable and visible at both
   widths.
7. For Canvas content, copy the fragment from the published authoring utility,
   paste it into the Rich Content Editor, save it, reopen HTML view, and review
   the retained result at desktop and narrow widths. Verify descriptive deep
   links and compare its instructional content with the course-site overview.

Record and resolve failures before publication. If a criterion cannot yet be
reliably validated, document the limitation without treating it as a pass.

The automated build and validation checks verify deterministic structure around
accessibility: the landing page is generated from a semantic HTML template,
required generated files and internal links exist and production decks omit
presenter notes. The responsive stylesheet provides visible focus treatment and
narrow-screen reflow.

Two rendered checks extend that coverage, and `pnpm check` runs both:

- `pnpm run check:slides` measures every slide and click state against the
  layout's content box. It catches content that overflows the slide or collides
  with the footer, and it fails on rendering errors that would otherwise ship a
  blank diagram.
- `pnpm run check:exercises` runs `axe-core` against the WCAG 2.1 A and AA rules
  it can evaluate, verifies the exercise document contract, and checks reflow at
  320 CSS pixels for SC 1.4.10. Because the exercise surface hides its overflow,
  it reports both horizontal page scrolling and content clipped inside an
  ancestor; either is a loss of information at that width.

These checks reduce known failure modes; they do not test assistive-technology
behavior, keyboard use, reading order, visual quality, or WCAG conformance. In
particular, no automated rule judges whether reflowed content remains usable,
whether a text alternative is accurate, or whether a slide is legible when
projected. The manual publication review remains required, and a passing check
is not a conformance claim.
