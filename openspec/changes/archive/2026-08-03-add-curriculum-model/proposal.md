## Why

ts-school has a build but no content model. Four later changes — the shell port,
the full taxonomy, the lesson engine, and the three content tiers — all need the
same answer to "what is a lesson, and where does the site learn about one?"
Writing them against three different answers is the failure mode this change
exists to prevent.

`vd3-docs`, the repo the scaffold was lifted from, hand-writes a 900-line
`src/nav.ts` and hand-imports 102 page components in `router.ts`. Every new page
is edited into three places, and nothing stops them drifting apart. ts-school
inverts that: the curriculum registry is the single source of truth, and the
navigation tree, the search index, and the route table are *derived* from it. A
lesson is added by adding one file; nav, search, and routing follow, or a test
fails.

The prerequisite graph is the other reason this is a change of its own. A
curriculum whose lessons claim prerequisites is only useful if those claims are
consistent — no cycles, no dangling ids, and no beginner lesson that quietly
depends on an advanced one. That is a property of the data, so it is enforced by
a test suite rather than by review.

## What Changes

- Add `src/curriculum/types.ts`: `Tier`, `TrackId`, `LessonId`, `LineRange`,
  `CodePane`, `TsCodePane`, `QuizQuestion`, `Exercise`, `Reference`,
  `SecurityNote`, `Track`, and the `Lesson` interface. `ExpectedDiagnostic` is
  imported from `@/typecheck/types` — the shared contract the typecheck worker
  also consumes — and deliberately not redefined.
- Add `src/curriculum/tracks.ts`: the ten tracks the curriculum is organised
  into, with titles, icons, order, and one-line descriptions.
- Add `src/curriculum/placeholder.ts`: the marked TODO code panes a stubbed
  lesson carries, plus `isPlaceholder()` so the lesson page and the
  compiler-truth suite can tell an unwritten lesson from a written one.
- Add `src/curriculum/lessons/foundations/*.ts` — one typed `Lesson` per file —
  and `src/curriculum/lessons/foundations/index.ts` collecting them. Foundations
  is the proving set for the machinery; the other nine tracks land in
  `add-full-taxonomy`.
- Add `src/curriculum/index.ts`: the registry. Sorts every lesson by
  track/tier/order and exposes `allLessons`, `lessonById`, `lessonsByTrack`,
  `lessonsByTier`, `lessonRoute`, `lessonNeighbours`, and `lessonCounts`.
- Add `src/nav.ts`: `NavTree` derived from the registry, keeping the
  `NavTree`/`NavTab`/`NavCategory`/`NavSection`/`NavPage` shapes from
  `vd3-docs/src/nav.ts` so the ported sidebar and search store consume it
  unchanged. Tabs are tiers; categories are tracks; sections are lessons.
- Add `src/pages/LessonPage.vue`: a placeholder route component rendering
  title, tier, track, and summary, explicitly marked for replacement by
  `add-lesson-engine`.
- Modify `src/router.ts`: splice one static route per lesson in ahead of the
  catch-all, derived from the registry.
- Add `tests/unit/curriculum.spec.ts` and `tests/unit/nav.spec.ts`: the
  integrity suite.

Routes added: one per registered lesson, at `/lessons/<track>/<lesson-id>`
(seventeen with this change, all in the `foundations` track). No route is
changed or removed.

## Non-goals

- **NO dual-pane lesson engine.** `LessonPage.vue` here is a placeholder that
  renders metadata only; `DualPane.vue`, `DiagnosticsList.vue`, and the
  `VdCodeEditor` wiring belong to `add-lesson-engine`.
- **NO lesson content.** Every `js`/`ts` pane is a marked placeholder. No lesson
  claims a diagnostic, so the compiler-truth suite is not in scope and cannot
  yet be run.
- **NO other nine tracks and no glossary.** `add-full-taxonomy` owns those, plus
  the `/curriculum` and `/glossary` pages.
- **NO docs shell.** No navbar, sidebar, footer, or overlays consume `nav.ts`
  yet; `port-docs-shell` wires them.
- **NO learner progress, quizzes, or exercises at runtime.** `QuizQuestion` and
  `Exercise` are typed here because `Lesson` references them, but nothing reads
  them; `add-learner-features` owns the behaviour.
- **NO typecheck worker.** `src/typecheck/` is the sibling change's territory;
  this change imports its type contract and modifies nothing in it.
- **NO Playwright specs.**

## Capabilities

### New Capabilities

- `curriculum-model`: the typed lesson data model, the registry that orders and
  indexes it, the navigation tree and route table derived from it, and the
  integrity suite that keeps the prerequisite graph and the tier ladder honest.

### Modified Capabilities

- `repo-scaffold`: `buildRoutes()` gains derived lesson routes. The contract it
  fixed — catch-all last, no `main.ts` edit — is exercised, not changed, so the
  scaffold spec needs no amendment.

## Impact

- `src/router.ts` grows a dependency on `src/curriculum/`. `src/main.ts` is
  untouched, as the scaffold intended.
- Route count rises from 2 to 19, so `vite-ssg` prerenders 18 static pages
  (the catch-all stays client-side).
- Fixes the interface `add-lesson-engine` replaces: it swaps the component
  behind the derived routes and reads `Lesson` from the registry, without
  touching routing or nav.
- Fixes the interface `port-docs-shell` consumes: `nav` from `@/nav` and the
  search entries derived from it.
