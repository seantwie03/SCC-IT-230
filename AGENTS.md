# Repository Guidance

## Repository rules

- Treat every committed file, Git revision, generated artifact, and workflow
  log as public. Presenter notes are public source even when production output
  omits them.
- Preserve the technical meaning of commands, output, learning objectives,
  demonstrations, exercises, and presenter notes.
- Do not add student information, credentials, assessment solutions,
  instructor-only material, restricted curriculum material, or an asset whose
  publication rights are unclear.
- Use text references only for St. Charles Community College and Red Hat. Do
  not add their logos, branded artwork, or visual identity elements without
  explicit authorization.
- Work directly on `main`; do not create feature branches or pull requests.
- Keep prospective changes unstaged during the instructor's manual review.
  Stage files only after the instructor explicitly approves the review.
- Run the relevant local validation before committing and pushing.

For an authorized weekly course-preparation task, consult the instructor’s
private source repository only as a read-only reference. Follow its root guidance
and use only material explicitly approved for public release.

## Required guidance

Read the relevant document before changing files in its area:

| Work | Required document |
| --- | --- |
| Slides, presenter notes, demonstrations, exercises, topic assets, or other course material | `docs/course-authoring.md` |
| Project structure, workspace boundaries, presentation registry, routes, or build output | `docs/architecture.md` |
| Staging, committing, pushing, deployment, publication checks, or production corrections | `docs/publishing.md` |

If a task crosses more than one area, read each applicable document. Update the
authoritative document when its enduring behavior changes rather than copying
its detailed rules into this file.

