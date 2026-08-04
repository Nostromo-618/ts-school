## Context

See proposal.md — Why. The taxonomy already registers 58 beginner lessons as
stubs. The lesson engine, typecheck worker (TS 6.0.3), and compiler-truth suite
are shipped. Sibling agents author intermediate and advanced in parallel; this
change may only edit beginner lesson modules under `src/curriculum/lessons/**`.

The in-browser host type-checks a single virtual `lesson.ts` with `strict: true`
by default, `noEmit`, forced module detection, and **no package `@types`**.
Snippets MUST NOT rely on resolving `node:*` or npm packages unless the lesson
intentionally authors the resulting diagnostic (e.g. TS2307) or inlines the
minimal ambient types it needs.

## Goals / Non-Goals

**Goals**

- Fill all 58 beginner lessons with compiler-truth-clean content.
- Prefer self-contained snippets that demonstrate real Node/JS pitfalls without
  needing a module graph.
- Add security notes where types and untrusted input meet, even at beginner
  depth (especially `any`, assertions, `JSON.parse`).

**Non-Goals (design-level)**

- Changing the typecheck host, Lesson type, or DualPane components.
- Importing real `@types/node` into the virtual filesystem.
- Rewriting summaries/prerequisites/ids unless a typo blocks teaching.

## Decisions

1. **Error-first vs fix-first TS panes**
   - Prefer TS panes that _show the catch_ (non-empty `expectedDiagnostics`) when
     the lesson's job is "TypeScript refuses this." Prefer silent, correctly
     typed panes when the lesson's job is "here is the safe shape," and put the
     deliberate mistake in the exercise starter.
   - Alternatives considered: always silent fixed panes (weaker live demo);
     always broken panes (weaker "this is how you write it" model).

2. **No shared-file edits by default**
   - Re-read `index.ts` / types / engine before any shared touch; prefer zero.
   - Alternatives: helper factories in shared modules — rejected to avoid
     colliding with parallel tier agents.

3. **Node migration without `@types/node`**
   - Teach migration concepts with plain TS that mirrors Node shapes (e.g.
     typed `process`-like objects declared locally, or intentional missing-module
     diagnostics) rather than extending the host.
   - Alternatives: teach-only prose without code — rejected; violates dual-pane
     contract.

4. **Quiz / exercise coverage**
   - Not every lesson needs both; foundations, types, runtime-boundary, and
     key migration lessons get both preferentially. Every lesson gets insights.

## Risks / Trade-offs

- **[Risk] Parallel agents touch shared registry** → Mitigation: edit only
  beginner lesson files; never regenerate `index.ts` imports unless a beginner
  file is missing (it should not be).
- **[Risk] Authored diagnostics drift from TS 6.0.3 wording** → Mitigation: match
  on `code` + `line` + optional short `messageIncludes`; run
  `mise exec -- pnpm test` frequently.
- **[Risk] Over-long snippets hurt mobile dual-pane** → Mitigation: keep panes
  short (roughly ≤25 lines) focused on one pitfall.
- **[Risk] Conceptual lessons (tsconfig, tsc CLI) don't map to runnable snippets**
  → Mitigation: still ship a typed pair that embodies the _consequence_ of the
  config choice (e.g. implicit any under non-strict thinking), not fake
  `tsconfig.json` parse trees the host cannot check.

## Migration Plan

1. Author track-by-track; run compiler-truth after each track.
2. Confirm zero beginner placeholders remain.
3. `openspec validate --strict`, then archive.
4. Final gates: lint, format:check, typecheck, test, build.
5. No deploy; leave uncommitted tree for the coordinator.

## Open Questions

_None — inventory and host constraints are known._
