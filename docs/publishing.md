# Publishing

## Normal workflow

The repository has one maintainer and uses `main` as its sole working and
publishing branch. Work locally on `main`, run the complete validation suite,
review the prospective commit as public material, commit, and push directly to
`main`. Do not use feature branches or pull requests.

The scripts in the root `package.json` are the authoritative commands for
local development, validation, and builds. Use a frozen pnpm installation when
verifying a clean checkout.

Install and validate from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm check
```

If the format check reports a supported file, apply the configured formatter
and validate again:

```sh
pnpm format
pnpm check
```

## Publication gates

Before pushing, confirm that:

- Commands, output, links, notes, demonstrations, and exercises are accurate.
- Presentation structure and the registry are valid.
- Slides and terminal content are readable at classroom scale.
- No student information, secrets, solutions, restricted curriculum source,
  or unapproved assets are present.
- Third-party material has a known publication basis and required attribution.
- The theme gallery, every registered presentation, and the course site build.
- `dist/` contains only intended public output.

## Deployment

GitHub Actions repeats deterministic validation on every push to `main` and
deploys only after validation succeeds. The deployment job uploads only
`dist/` to GitHub Pages. The production site uses
<https://it230.systemsmeta.tech>.

After deployment, verify the landing page, every changed presentation, linked
downloads, and a representative nested hash route in production.

## Corrections

Use a roll-forward workflow. If production is faulty, make the smallest
appropriate correction locally, run the complete validation workflow, commit
the correction, and push the new commit to `main`. The manual workflow trigger
may redeploy a known commit when the content itself does not require a change.
