## Context

See proposal.md — Why. Scaffold already ships `playwright.config.ts` that
serves `pnpm preview` on `http://localhost:8787` (built `vite-ssg` output) and
defines Chromium Desktop as the project behind `pnpm test:e2e`.
`@axe-core/playwright` is a declared dependency. Application features under
test (DualPane, QuizBlock, ExerciseBlock, progress store, GlobalSearchModal,
SchoolThemeSwitcher) already exist.

## Goals / Non-Goals

**Goals**

- Stable Chromium Desktop e2e covering the seven acceptance areas in the spec.
- Fixtures pinned to a known beginner lesson with real content, diagnostics,
  quiz, and exercise (e.g. `first-type-error`).
- Snapshots committed beside the visual spec; update once with Playwright's
  update flag when first landing baselines.
- Keep CSP and security posture unchanged; never use `eval` / `v-html` in tests
  or app code.

**Non-Goals**

- Rewriting `playwright.config.ts` to use the dev server.
- Authoring or editing lesson modules.
- Making Firefox/WebKit/Mobile part of the default gate.

## Decisions

1. **Fixture lesson = `first-type-error`**
   - Authored beginner foundations lesson with `expectedDiagnostics` (TS2345),
     quiz, and exercise (`assertion: "no-errors"` + solution).
   - Route: `/lessons/foundations/first-type-error`.
   - Alternative considered: `why-types` — also strong, but first-type-error's
     exercise solution is a one-line fix that is easy to paste in e2e.

2. **Run against preview, not dev**
   - Match existing `webServer.command` (`pnpm run preview`). CI and local
     e2e assume a prior `pnpm build`. Document that in tasks; do not change
     config to auto-build (build is slow and already a separate CI step).

3. **Selectors prefer accessible names**
   - JS/TS panes: `aria-label` values already on DualPane / LiveTsPane.
   - Diagnostics: `role="region"` named "TypeScript diagnostics".
   - Quiz/exercise: headings and `role="status"` feedback.
   - Theme: `aria-label` / `data-theme-value` on SchoolThemeSwitcher.
   - Avoid brittle CSS class coupling beyond stable `ts-*` / `vd-doc-search-*`
     contracts already used by the shell.

4. **Live diagnostic assertion strategy**
   - Lesson loads with a prerendered diagnostic (TS2345). To prove *live*
     worker feedback, clear/fix the TS pane to a known-bad snippet (e.g.
     `const n: number = "x";`) and wait for a diagnostics list item containing
     `TS` + an error code, after debounce (~250ms+) and worker round-trip.
   - Alternative: delete the call site so diagnostics go empty then reintroduce
     the error — also valid; prefer the explicit bad snippet for clarity.

5. **A11y: serious/critical only; disable `color-contrast`**
   - Match common CI practice for impact filtering. Additionally disable axe
     `color-contrast`: vd3's primary blue (`#339af0`) fails WCAG AA against
     white / on primary buttons. That is a design-system issue (read-only
     packages), not a ts-school markup regression. Other serious/critical
     rules still gate.

6. **Visual baselines**
   - `toHaveScreenshot` with full-page or viewport captures at 1920×1080.
   - Mask or disable animations if flakiness appears (theme transitions).
   - Store under Playwright's default `__snapshots__` next to the visual spec.

7. **Progress assertion**
   - After quiz/exercise interaction, read `localStorage.getItem('ts-school-progress')`
     and parse JSON; after reload, assert the same lesson id is still present.

## Risks / Trade-offs

- **[Risk] Worker / lib fetch timing flaky under CSP** → Wait for diagnostics
  region to leave "Checking…" and assert with generous timeouts; ensure
  `public/ts-lib/` is present from `prebuild` sync.
- **[Risk] Visual flake from fonts / charts on history** → Prefer soft maxDiff
  pixel threshold if needed; keep history in a11y + visual as required by spec.
- **[Risk] Preview reuseExistingServer locally serves stale build** → Tasks
  require an explicit `pnpm build` before first e2e run in a session.

## Migration Plan

N/A — additive test suite. Archive the OpenSpec change once gates are green.

## Open Questions

_None._
