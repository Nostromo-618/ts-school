## Why

The curriculum map and glossary already exist, but the site still lacks the
context pages that explain *where TypeScript came from* and *what this school
is*. Without `/history` and `/about`, the navbar stops at inventory, and the
adoption story the plan calls for never lands.

## What Changes

- Add `/history` — a milestone timeline (ES5 → modern JS, Node.js, TypeScript
  1→6, TS 7 Go native port) driven by vd3's `useTimeline`, plus
  `VdLineChart` / `VdBarChart` adoption charts from `@vanduo-oss/vd3-cbun/charts`
  with sourced citations or an explicit "illustrative" label.
- Add `/about` — what TypeScript School is, why the in-browser checker pins
  TypeScript 6.0.3, and how lessons pair fragile JS with live TS.
- Keep `/` (home) and the catch-all not-found page solid; polish not-found
  links into the curriculum if needed.
- Wire `/history` and `/about` into `buildRoutes()`, the hand-written
  standalone `PAGES` list in `src/nav.ts` (so they appear in the navbar and
  search index), and the footer site links.
- Add typed milestone / chart data under `src/data/` (or equivalent).

Routes added: `/history`, `/about`. Routes unchanged: `/`, `/curriculum`,
`/glossary`, lesson routes, catch-all. No routes removed.

## Non-goals

- **NO lesson engine, DualPane, quizzes, exercises, or progress store.** A
  sibling agent owns `LessonPage.vue`, `src/components/lesson/`,
  `src/stores/progress.ts`, and `src/typecheck/`.
- **NO lesson content** under `src/curriculum/lessons/`.
- **NO Playwright e2e authoring** or visual-baseline updates in this change
  (house rule notes them when markup changes; e2e is a later plan todo).
- **NO TypeScript upgrade.** Stay on 6.0.3; TS 7 is mentioned only as teaching
  context on `/history` and `/about`.
- **NO `initialState` in `main.ts`** (CSP). No `v-html` / `innerHTML` / `eval`.

## Capabilities

### New Capabilities

- `supporting-pages`: top-level context pages — history timeline and adoption
  charts, about, and a solid not-found — wired into routes, derived nav, and
  search.

### Modified Capabilities

- (none)

## Impact

- `src/router.ts`, `src/nav.ts`, and `src/layout/SchoolFooter.vue` gain two
  standalone pages (merge carefully with any sibling lesson-meta edits).
- New page SFCs and data modules; optional small layout helpers in
  `src/styles/app.css` (shell/layout only).
- Search-store unit expectations rise from 3 standalone pages to 5.
- `vite-ssg` prerender route count rises by two (`/history`, `/about`).
- Charts CSS is already imported in `main.ts`; no new package dependencies.
