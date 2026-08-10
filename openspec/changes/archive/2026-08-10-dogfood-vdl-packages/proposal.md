## Why

Dogfood the promoted standalone packages `@vanduo-oss/vdl-ai-chat` and
`@vanduo-oss/vdl-hybrid-search` instead of the labs umbrella `@vanduo-oss/vdl-engines`.

## What Changes

- Replace `file:../0_vanduo/labs` with the two private package `file:` deps
- Rename `NeptuneSearch` → `HybridSearch`
- Import guardrails/markdown from vdl-ai-chat subpaths
- Drop hand-written ambient `vdl-engines` module declarations (packages ship `.d.ts`)
- Update CI/Pages/visual-baseline workflows to clone the two private repos

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `semantic-search`: engine class rename to HybridSearch
- `lesson-ai-assistant`: consume `@vanduo-oss/vdl-ai-chat`

## Impact

- Local and CI layout must include both sibling package clones
- Labs demos unchanged

## Non-goals

- Publishing the VDL packages to npm
- Rewiring labs
