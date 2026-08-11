## Why

`@vanduo-oss/vdl-ai-chat` and `@vanduo-oss/vdl-hybrid-search` are published on
npm (`0.1.0` / `0.1.1`). Continuing to install them via `file:` siblings forces
local clones and CI checkout/link/build steps that are no longer needed and
block a clean one-repo contributor path.

## What Changes

- Resolve both VDL engine packages from the npm registry (`^0.1.0` / `^0.1.1`)
  instead of `file:../0_vanduo/...`
- Refresh `pnpm-lock.yaml` so lockfile entries are registry resolutions
- Remove sibling-clone / symlink / build-VDL steps from GitHub Actions
  (`ci.yml`, `pages.yml`, `update-visual-baselines.yml`)
- Align README and live OpenSpec purposes with published npm consumption
- Routes/lessons: none added, changed, or removed

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `lesson-ai-assistant`: require the published `@vanduo-oss/vdl-ai-chat` npm
  package (not a `file:` sibling) and replace the TBD purpose
- `semantic-search`: require the published `@vanduo-oss/vdl-hybrid-search` npm
  package (not a `file:` sibling) and replace the TBD purpose
- `repo-scaffold`: document that VDL engines install from the registry with no
  sibling-clone prerequisite for local or CI install

## Impact

- `package.json` / `pnpm-lock.yaml` / `.npmrc` (existing age-exclude for
  `@vanduo-oss/*`)
- `.github/workflows/*` install flow simplifies to checkout → pnpm install
- README contributor prerequisites shrink to mise + `pnpm install`
- No application API or curriculum content changes

## Non-goals

- Bumping beyond the published `0.1.x` lines or rewriting engine APIs
- Changing vd3 / vd3-cbun consumption
- Publishing ts-school itself
- Removing harmless eslint ignores for legacy `.ci-vdl-*` paths (optional cleanup)
