## Why

The curriculum taxonomy stubs every beginner lesson with placeholder panes, so
the dual-pane engine and compiler-truth suite have nothing real to teach yet.
Node.js JavaScript developers migrating to TypeScript need the full beginner
tier filled with honest JS-vs-TS pairs before intermediate and advanced content
can build on those prerequisites.

## What Changes

- Replace `placeholderJsPane()` / `placeholderTsPane()` in every lesson where
  `tier === "beginner"` (58 lessons across foundations, types, functions,
  structures, runtime-boundary, async, node-migration, tooling, and testing)
  with authored JS and TS panes, insights, and where useful security notes,
  quizzes, and exercises with solutions.
- Every authored beginner TS pane (and every exercise `solution`) MUST pass the
  existing compiler-truth suite against TypeScript 6.0.3 — no placeholders left
  in the beginner tier.
- Lesson routes are unchanged: same ids, same `/lesson/:id` URLs; only lesson
  module bodies change. No engine, registry, or shared-shell edits unless a
  re-read proves strictly necessary (prefer zero shared edits).

## Non-goals

- **NO intermediate or advanced lesson content** — sibling agents own those
  files; this change must not edit modules where `tier !== "beginner"`.
- **NO Playwright e2e**, visual baselines, or axe coverage —
  `add-e2e-coverage` owns those.
- **NO lesson-engine, progress-store, or typecheck-worker feature work** beyond
  consuming their published surfaces.
- **NO new tracks, lesson ids, or tier reassignments** — taxonomy is fixed.
- **NO TypeScript upgrade**; 6.0.3 stays pinned.
- **NO commits** from this change agent unless a coordinator explicitly requires
  one; leave the working tree for coordination.

## Capabilities

### New Capabilities

- `beginner-curriculum`: full beginner-tier lesson content — JS-vs-TS panes,
  insights, optional security / quiz / exercise — all compiler-truth clean.

### Modified Capabilities

_None — `lesson-engine` and `learner-features` already define how panes,
diagnostics, quizzes, and exercises are rendered and checked._

## Impact

- 58 files under `src/curriculum/lessons/**` where `tier === "beginner"`.
- Compiler-truth suite will check all 58 panes (and any exercise solutions)
  instead of skipping them as stubs.
- Derived nav/search index unchanged in shape; search snippets gain real
  `problem` / keyword value already present on stubs.
- vite-ssg continues to prerender the same lesson routes with authored
  `expectedDiagnostics` as the SSG fallback.
