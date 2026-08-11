## Context

See proposal.md — Why. `package.json` already declares
`@vanduo-oss/vdl-ai-chat@^0.1.0` and `@vanduo-oss/vdl-hybrid-search@^0.1.1`, but
`pnpm-lock.yaml` still pins `file:../0_vanduo/...`. `ci.yml` is clean;
`pages.yml` and `update-visual-baselines.yml` still clone/link/build the VDL
siblings. README already describes npm installs; live specs still carry TBD
purposes from the earlier dogfood archive.

## Goals / Non-Goals

**Goals:**

- Lockfile and CI match registry consumption end-to-end
- Specs/docs no longer imply unpublished `file:` dogfood
- Full local quality gates remain green after the switch

**Non-Goals:**

- Engine API changes or major version bumps
- Reworking eslint ignore entries beyond optional cleanup
- Committing or pushing (left for a later explicit request)

## Decisions

1. **Caret ranges (`^0.1.0` / `^0.1.1`)** — keep as already in `package.json`
   so patch/minor updates can land via lockfile refresh. Alternative: exact
   pins; rejected because vd3 already uses exact pins for design-system
   stability while engines can follow published patches.

2. **Strip VDL clone steps from all three workflows** — align Pages and visual
   baselines with the already-simplified `ci.yml`. Alternative: keep clones as
   a fallback; rejected because lockfile will no longer point at `file:`.

3. **Fix TBD Purpose on live specs during apply** — OpenSpec deltas cannot
   replace Purpose for existing capabilities; edit
   `openspec/specs/lesson-ai-assistant/spec.md` and
   `openspec/specs/semantic-search/spec.md` directly when applying.

4. **Keep `.ci-vdl-*` eslint ignores** — harmless if unused; removing is
   optional and not required for correctness.

## Risks / Trade-offs

- [Fresh publish + minimum-release-age] → `.npmrc` already excludes
  `@vanduo-oss/*`; install may still need `--safe-chain-skip-minimum-package-age`
  if a wrapper enforces age separately.
- [Published package missing build artifacts] → packages ship `dist` on npm;
  verify with typecheck/build after install.
- [Transient registry/network failure during `pnpm install`] → retry; do not
  fall back to `file:`.

## Migration Plan

1. Confirm `package.json` ranges.
2. Run `pnpm install` to rewrite lockfile from registry.
3. Remove sibling VDL steps from Pages and visual-baseline workflows.
4. Update live spec Purpose text + README consistency pass.
5. Run format/lint/stylelint/typecheck/test/build (and e2e if feasible).
6. Validate and archive the OpenSpec change.

Rollback: restore `file:` specs in `package.json`, regenerate lockfile against
siblings, and reintroduce CI clone steps from git history.
