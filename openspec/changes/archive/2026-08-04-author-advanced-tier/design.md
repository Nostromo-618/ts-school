## Context

See proposal.md for motivation. The taxonomy already registers 52 advanced
lessons across all ten tracks. Each file exports metadata and placeholder panes.
The lesson engine, typecheck host (strict, `lib: es2022`, no `@types`, forced
module detection), and compiler-truth suite already exist; this change only
fills content.

Sibling agents own beginner and intermediate files — prefer zero shared-file
edits.

## Goals / Non-Goals

**Goals:**

- Author all 52 advanced lessons to the dual-pane + quiz + exercise contract.
- Keep every diagnostic claim honest under TypeScript 6.0.3.
- Prefer self-contained snippets that type-check in the virtual host (no real
  Node/`express` imports — simulate boundaries with local types when needed).

**Non-Goals:**

- Engine, host, route, or glossary changes.
- Editing beginner/intermediate lesson modules.
- Playwright baseline updates (page shell markup unchanged).

## Decisions

### 1. Teach with a deliberate error in the TS pane when the topic is a failure mode

Many advanced topics are “what goes wrong.” Those lessons put a small, real
type error in the TS pane and author matching `expectedDiagnostics`. Lessons
that teach a correct pattern (e.g. a working `infer` helper) use an empty
`expectedDiagnostics` list and put the broken starting point in the exercise
starter instead.

**Alternative considered:** Always silent TS panes — rejected because learners
would not see live diagnostics for failure-mode topics.

### 2. Simulate package/Node APIs inside the snippet

The host sets `types: []` and has no filesystem packages. Lessons about Express
augmentation, workers, or publishing use local `declare module` / interface
stand-ins that preserve the teaching point without requiring `@types/node`.

**Alternative considered:** Extend the host with Node libs for some lessons —
rejected to avoid shared-file edits and keep the sandbox uniform.

### 3. Security notes on trust-boundary lessons only

Required for branded validated types, deserialization, declaration soundness /
publishing, dual-package hazard, trusting the database, and similar. Omitted for
pure checker-internals lessons (`infer`, variance algorithm, CFA).

### 4. Advanced pacing: short panes, dense insights

Panes stay small (roughly 15–40 lines). Insights carry the algorithm or design
rule. Quizzes test prediction (“what does T become?”), not trivia.

## Risks / Trade-offs

- [Sibling race on shared files] → Edit only advanced lesson modules; never
  touch `index.ts`, `types.ts`, `main.ts`, or CSS.
- [Diagnostic line drift when editing prose] → Re-run compiler-truth after each
  batch; use `messageIncludes` substrings, not full messages.
- [Conceptual lessons forced into code] → Accept illustrative stand-ins; the
  quiz/insights carry nuance the snippet cannot.

## Migration Plan

No runtime migration. After authoring: `pnpm test` (compiler-truth), integrity
suite, `openspec validate --strict`, archive the change. Rollback is reverting
the lesson file edits.
