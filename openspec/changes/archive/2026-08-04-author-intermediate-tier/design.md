## Context

See proposal.md — Why. The lesson engine, typecheck host (baseline `es2022`,
`strict: true`, `types: []`), and compiler-truth suite already exist. All 91
intermediate lessons are taxonomy stubs. Sibling agents author beginner and
advanced; this change edits only `tier === "intermediate"` lesson modules.

## Goals / Non-Goals

**Goals**

- Author all 91 intermediate lessons to the dual-pane contract.
- Make runtime-boundary and node-migration the showcase tracks.
- Pass compiler-truth, curriculum integrity, lint, format, typecheck, build.

**Non-Goals (design-level)**

- Do not add `@types/node` or lesson-level `TypecheckOptions` to the host.
- Do not change `Lesson` shape, routes, or `main.ts` initialState.
- Do not touch beginner/advanced lesson files or shared non-lesson modules
  unless a blocking shared bug appears (prefer in-snippet ambient stubs).

## Decisions

1. **Ambient Node stubs in snippets** — The virtual host cannot resolve
   `node:fs` or `process`. Node-migration (and some tooling) lessons declare
   minimal `declare module` / `declare const` stubs at the top of the pane so
   teaching focuses on the typed API shape, not package resolution.
   Alternative considered: extending the host with `@types/node` — rejected to
   keep the worker bundle and surface area small and avoid shared-file edits.

2. **Strict baseline only** — Flag-specific tooling lessons (`strictNullChecks`,
   `noUncheckedIndexedAccess`, etc.) teach under the host's fixed `strict:
true`. Where a flag is not on by default (e.g. `noUncheckedIndexedAccess`),
   the pane demonstrates the hazard with an explicit `| undefined` model or
   documents the flag in insight while still producing truthful diagnostics.

3. **Security notes mandatory on runtime-boundary** — All 8 intermediate
   runtime-boundary lessons include `security` with appropriate severity.
   Node lessons that touch env/CLI/HTTP MAY add caution notes.

4. **Diagnostics-first authoring** — Draft TS panes, run real `tsc` via the
   session helper, then lock `expectedDiagnostics` (`code`, `line`, optional
   `messageIncludes`). Prefer one clear teaching diagnostic over noisy panes.

5. **Quiz/exercise density** — Prefer quiz+exercise on runtime-boundary,
   node-migration, generics, and discriminated-union lessons; lighter tracks
   may ship pane+insight only when sufficient.

## Risks / Trade-offs

- **[Risk] Ambient stubs drift from real `@types/node`** → Mitigation: keep
  stubs tiny and caption that they are teaching shims; point references at
  Node docs / DefinitelyTyped.
- **[Risk] Sibling agents edit shared files** → Mitigation: touch only
  intermediate lesson modules and OpenSpec artifacts.
- **[Risk] Compiler message wording drift** → Mitigation: use
  `messageIncludes` substrings, not full message equality.
- **[Risk] Large content batch fails mid-run** → Mitigation: author by track;
  run `pnpm test` after each track.

## Migration Plan

1. Author OpenSpec artifacts; validate change.
2. Fill lessons track-by-track; run compiler-truth frequently.
3. Confirm zero intermediate placeholders.
4. `openspec validate --strict`; archive change.
5. Final gates: lint, format:check, typecheck, test, build.
6. No deploy; no commit unless the user asks.

## Open Questions

_None — ambient-stub approach and tier scope are fixed by the plan and host
constraints._
