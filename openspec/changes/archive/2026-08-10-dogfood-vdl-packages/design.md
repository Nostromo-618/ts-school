## Context

Engines moved out of labs into dedicated private TypeScript packages. ts-school
must switch `file:` deps and rename Neptune → HybridSearch.

## Goals / Non-Goals

**Goals:** compile and test against the new packages; CI clone layout updated.

**Non-Goals:** npm publish; labs rewire; behavior changes beyond rename/import paths.

## Decisions

1. Use package root + documented subpath exports (no `.js` suffix on subpaths).
2. Rely on package-emitted `.d.ts` instead of ambient `env.d.ts` shims.
3. Clone both private repos in CI the same way Labs was cloned.

## Risks / Trade-offs

- Private repo checkout in CI needs org Actions access to sibling private repos.

## Migration Plan

Install → typecheck → unit tests → archive this change.

## Open Questions

- None.
