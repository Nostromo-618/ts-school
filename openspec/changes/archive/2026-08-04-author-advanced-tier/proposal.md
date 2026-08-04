## Why

The advanced tier is still taxonomy stubs: every topic is registered, routed, and
searchable, but the dual panes, insights, quizzes, and exercises are placeholders.
Without authored content the site cannot teach type-level programming, inference
internals, declaration authoring, or the other advanced subjects the charter
promises — and the compiler-truth suite has nothing to enforce for this tier.

## What Changes

- Replace placeholder panes for every lesson where `tier === "advanced"` (52
  lessons) with full JS-vs-TS content, insights, quizzes, and exercises.
- Author accurate `expectedDiagnostics` that match TypeScript 6.0.3 output for
  every TS pane and every exercise solution.
- Add security notes where the topic warrants them (branded validated types,
  deserialization, declaration soundness, dual-package hazards).
- Leave beginner and intermediate lessons untouched.
- No new routes, tracks, lesson ids, or engine changes — fill existing stubs only.

## Non-goals

- Authoring beginner or intermediate lessons (sibling changes own those).
- Changing the lesson engine, typecheck worker, progress store, or shell.
- Upgrading TypeScript past 6.0.3 or adding `@typescript/native-preview`.
- Editing `main.ts` initial state, shared CSS beyond what a lesson file needs,
  or Playwright baselines (markup shape of lesson pages is unchanged).
- Adding new lesson ids or renumbering the taxonomy.

## Capabilities

### New Capabilities

- `advanced-tier-content`: Full authored content contract for every advanced-tier
  lesson — dual panes, compiler-truth diagnostics, insights, quizzes, exercises,
  and security notes where relevant.

### Modified Capabilities

- `curriculum-taxonomy`: Clarify that advanced-tier lessons MUST be fully authored
  (no placeholder panes) once this change lands, while lower tiers may still be
  stubs owned by sibling changes.

## Impact

- Touches only `src/curriculum/lessons/**/*.ts` files whose `tier` is `"advanced"`.
- Compiler-truth suite begins checking those 52 panes and their exercise solutions.
- Derived nav/search unchanged (same ids/routes); prerendered pages gain real
  content for advanced lesson URLs.
- No dependency or package changes.
