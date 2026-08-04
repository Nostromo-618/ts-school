## Why

The intermediate tier is still taxonomy stubs: every lesson where
`tier === "intermediate"` carries `placeholderJsPane` / `placeholderTsPane`.
The dual-pane engine and compiler-truth suite are ready; Node JS-native
developers need the runtime-boundary and node-migration tracks filled so the
product's differentiator is visible, not just registered.

## What Changes

- Replace placeholder panes for **every** intermediate-tier lesson (~91) with
  real JS-left / TS-right pairs, insights, and accurate `expectedDiagnostics`.
- Emphasize **runtime-boundary** (unknown, guards, validators, untrusted input)
  and **node-migration** (CJS→ESM, `@types`, `node:*`, env, streams, fs) with
  mandatory `security` notes on runtime-boundary lessons.
- Add quiz and exercise where they teach; exercise solutions must pass the
  same compiler-truth assertion as the lesson panes.
- No new routes; lesson ids, tiers, tracks, order, and prerequisites stay as
  registered by `add-full-taxonomy`. Derived nav/search continue to resolve
  the same URLs with authored bodies.

## Non-goals

- **NO beginner or advanced lesson authoring** — sibling agents own those files.
- **NO engine, curriculum-model, or typecheck-host changes** unless a shared
  bug blocks intermediate content; prefer ambient stubs inside lesson snippets
  over host changes (no `@types/node` in the virtual FS).
- **NO Playwright e2e / visual baselines** — `add-e2e-coverage` owns those.
- **NO TypeScript upgrade**; stay on 6.0.3.
- **NO commits or pushes**.

## Capabilities

### New Capabilities

- `intermediate-curriculum`: authored intermediate-tier lesson content —
  dual-pane pairs, diagnostics claims, insights, security notes on
  runtime-boundary lessons, quizzes/exercises where pedagogical, all passing
  compiler-truth.

### Modified Capabilities

- `lesson-engine`: extend the compiler-truth expectation so every
  intermediate-tier lesson MUST be authored (non-placeholder) and MUST pass
  the suite; intermediate placeholders are no longer allowed after this change.

## Impact

- Edits only under `src/curriculum/lessons/**` for files with
  `tier: "intermediate"` (and OpenSpec change artifacts).
- Compiler-truth suite will check ~91 additional authored panes plus any
  exercise solutions.
- vite-ssg prerender continues to emit the same lesson routes with real
  `expectedDiagnostics` fallbacks.
- No dependency or package.json changes.
