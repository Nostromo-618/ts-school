## ADDED Requirements

### Requirement: VDL engines install without sibling clones

A clean clone of ts-school MUST install `@vanduo-oss/vdl-ai-chat` and
`@vanduo-oss/vdl-hybrid-search` from the npm registry with `pnpm install`
alone. Local and CI workflows MUST NOT require cloning, symlinking, or
building those repositories as a prerequisite to install or build ts-school.

#### Scenario: contributor installs without VDL siblings
- **GIVEN** a clean clone and no `../0_vanduo/vdl-*` checkouts
- **WHEN** the contributor runs `mise exec -- pnpm install`
- **THEN** both VDL engine packages install successfully from the registry

#### Scenario: CI install has no VDL sibling checkout steps
- **GIVEN** the GitHub Actions workflows for CI, Pages, and visual baselines
- **WHEN** a maintainer inspects the install steps
- **THEN** those workflows run `pnpm install` without checkout/link/build
  steps for `vdl-ai-chat` or `vdl-hybrid-search`
