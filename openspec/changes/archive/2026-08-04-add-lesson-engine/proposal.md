## Why

Phase 1–2 shipped the curriculum registry, docs shell, and in-browser typecheck
worker, but `LessonPage.vue` is still a metadata placeholder. Learners cannot
see the JS-vs-TS pair, edit the TS pane, or read live diagnostics — the product
promise is unrealised until one route component mounts the dual-pane engine
against `useTypecheck()` and CI asserts every authored claim against real
TypeScript 6.0.3.

## What Changes

- Add `src/components/lesson/DualPane.vue`: desktop side-by-side JS | TS panes;
  mobile `VdTabs`. Left pane is a read-only `VdCodeEditor` (`language:
  "javascript"`). Right pane is an editable `VdCodeEditor` (`language:
  "typescript"`) wired to `useTypecheck` with prerendered
  `expectedDiagnostics` as `initialDiagnostics`.
- Add `src/components/lesson/DiagnosticsList.vue`: beneath the TS pane — line,
  column, TS error code, message (`white-space: pre-wrap`, never `v-html`), and
  jump-to-line. Honest that `VdCodeEditor` has no gutter-marker API.
- Add `src/components/lesson/TierBadge.vue`: beginner / intermediate / advanced
  via the shared presentation constants.
- Rewrite `src/pages/LessonPage.vue`: title, tier, track, problem, DualPane,
  insights, optional security note, optional `VdFlowchart` when `diagram` is
  present (graceful when absent). Stub lessons (`isPlaceholder`) still show
  problem/summary/tier and placeholder panes without spinning a live worker.
- Add the compiler-truth Vitest suite: for every lesson whose TS pane is
  authored (not a placeholder), run real TS 6 via `createTypecheckSession` and
  assert `matchesExpected(actual, expectedDiagnostics)`. Placeholder / TODO
  panes are skipped so unfinished taxonomy stubs do not fail CI.

Routes: no routes added or removed. Every existing lesson route continues to
resolve to `LessonPage.vue`; only the body of that component changes. No lesson
content is authored.

## Non-goals

- **NO full lesson content** for beginner / intermediate / advanced tiers —
  later agents author panes, quizzes, and exercises.
- **NO learner progress, quizzes, or exercises** — `add-learner-features` owns
  `progress.ts`, `QuizBlock.vue`, `ExerciseBlock.vue`, and curriculum
  `VdProgress` meters.
- **NO Playwright e2e** and no visual baselines — `add-e2e-coverage` owns those.
- **NO `/history`, `/about`, or supporting-page data** — a sibling agent owns
  those; this change stays out of `src/pages/history.vue`, `src/pages/about.vue`,
  and any timeline data files.
- **NO curriculum model or typecheck API changes** beyond consuming the
  published surfaces (`@/curriculum`, `@/typecheck`).
- **NO TypeScript upgrade**; 6.0.3 stays pinned.

## Capabilities

### New Capabilities

- `lesson-engine`: dual-pane lesson rendering, live diagnostics list, tier
  badge, LessonPage composition, prerendered diagnostic fallback, and the
  compiler-truth Vitest suite over authored lessons.

### Modified Capabilities

_None — `curriculum-model` and `typecheck-worker` already publish the Lesson
shape and `useTypecheck` / `matchesExpected` surfaces this change consumes._

## Impact

- New `src/components/lesson/` directory; rewrite of `src/pages/LessonPage.vue`.
- New `tests/unit/compiler-truth.spec.ts` (or equivalent) loading
  `public/ts-lib/` the same way `typecheck-host.spec.ts` does.
- Minor shell CSS for dual-pane layout geometry in `app.css` or scoped SFC
  styles — no vd3 component restyling.
- Build continues to prerender every lesson route (~204); SSG pages show
  authored `expectedDiagnostics` before hydration.
