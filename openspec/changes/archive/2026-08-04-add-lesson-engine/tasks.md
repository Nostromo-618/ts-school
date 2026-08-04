# Tasks

## 1. Lesson components

- [x] 1.1 Add `src/components/lesson/TierBadge.vue` wrapping `VdBadge` with
      `TIER_LABELS` / `TIER_BADGE_VARIANTS` from `@/curriculum`.
- [x] 1.2 Add `src/components/lesson/DiagnosticsList.vue`: line, column, TS
      code, message with `white-space: pre-wrap` (never `v-html`), jump emit,
      empty and checking states.
- [x] 1.3 Add `src/components/lesson/DualPane.vue`: desktop side-by-side JS | TS
      (`VdCodeEditor` from `@vanduo-oss/vd3-cbun/code-editor`); mobile `VdTabs`;
      read-only JS; editable TS; `useTypecheck` when TS is not a placeholder;
      `expectedDiagnostics` mapped to `initialDiagnostics`; DiagnosticsList
      with jump-to-line via editor `setSelection` / `focus`.
- [x] 1.4 Add a small `toPrerenderedDiagnostics` helper (colocated or under
      `src/components/lesson/`) mapping `ExpectedDiagnostic[]` →
      `TsDiagnostic[]` for SSG fallback.

## 2. Lesson page

- [x] 2.1 Rewrite `src/pages/LessonPage.vue`: breadcrumbs, title, TierBadge,
      track, summary, problem, DualPane, insights, optional security note,
      optional `VdFlowchart` when `diagram` present, pager. Stub-friendly
      messaging when `isPlaceholder(ts)`.
- [x] 2.2 Add dual-pane layout geometry to `src/styles/app.css` (shell/layout
      only — no component restyling).

## 3. Compiler-truth suite

- [x] 3.1 Add `tests/unit/compiler-truth.spec.ts`: load libs from
      `public/ts-lib/` (same pattern as `typecheck-host.spec.ts`); for every
      lesson, skip when `isPlaceholder(lesson.ts)`, otherwise
      `createTypecheckSession` + `matchesExpected` against
      `expectedDiagnostics`; document the skip rule in the file header.
- [x] 3.2 Confirm stub-only curriculum yields a green suite (all skipped or
      empty authored panes).

## 4. Gates

- [x] 4.1 `pnpm lint`, `pnpm stylelint`, `pnpm run format:check`,
      `pnpm typecheck` pass.
- [x] 4.2 `pnpm test` passes including compiler-truth.
- [x] 4.3 `pnpm build` prerenders all routes clean (~204).
- [x] 4.4 Note: Playwright visual baselines deferred to `add-e2e-coverage`
      (no e2e specs exist yet to update).
- [x] 4.5 `openspec validate add-lesson-engine --strict` passes; archive after
      implementation.
