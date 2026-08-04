# Tasks

## 1. History data

- [x] 1.1 Author `src/data/history.ts` with typed milestones (ES5 → modern JS,
      Node.js, TypeScript 1→6, TS 7 Go port + the 6.0.3 checker teaching note)
      and illustrative chart series for line and bar charts.
- [x] 1.2 Add `tests/unit/history-data.spec.ts`: milestones are ordered, cover
      the required eras, and chart series are flagged illustrative.

## 2. Pages

- [x] 2.1 Author `src/pages/history.vue`: `useTimeline` on
      `.vd-timeline.vd-timeline-animated`, `VdLineChart` / `VdBarChart`, visible
      illustrative disclosure, TS 6.0.3 teaching note.
- [x] 2.2 Author `src/pages/about.vue`: school promise, audience, stack, TS 6
      vs 7 note, links to curriculum and history.
- [x] 2.3 Polish `src/pages/not-found.vue`: keep solid 404, add curriculum
      escape hatch, explicit `RouterLink` import.
- [x] 2.4 Add only layout primitives needed for history/about to
      `src/styles/app.css` (shell/layout only; no component restyling).

## 3. Wiring

- [x] 3.1 Re-read and extend `src/router.ts` with `/history` and `/about`
      ahead of the catch-all (additive only).
- [x] 3.2 Re-read and extend `src/nav.ts` `PAGES` with history and about
      entries (titles, icons, keywords).
- [x] 3.3 Re-read and extend `SchoolFooter.vue` site links for history and
      about.
- [x] 3.4 Update nav/search unit expectations for the two new standalone
      pages (`nav.spec.ts`, `search-store.spec.ts`).

## 4. Verification

- [x] 4.1 Derived nav/search verification: standalone pages include
      `/history` and `/about`; search indexes them.
- [x] 4.2 `mise exec -- pnpm lint`, `stylelint`, `format:check`, and
      `typecheck` pass.
- [x] 4.3 `mise exec -- pnpm test` passes.
- [x] 4.4 `mise exec -- pnpm build` prerenders `/history` and `/about`
      (vite-ssg house rule).
- [x] 4.5 Compiler-truth suite: not applicable — no lesson content changed.
- [x] 4.6 Playwright visual baselines: not applicable in this change — no
      Playwright authoring (deferred to `add-e2e-coverage`).
- [x] 4.7 `openspec validate add-supporting-pages --strict` passes, then
      archive the change.
