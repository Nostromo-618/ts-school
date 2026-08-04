# Tasks

## 1. Specs and fixtures

- [x] 1.1 Confirm Playwright Chromium is installed (`mise exec -- pnpm exec playwright install chromium` if needed).
- [x] 1.2 Pin fixture lesson `first-type-error` (`/lessons/foundations/first-type-error`) for dual-pane, quiz, exercise, progress, a11y, and visual lesson page.

## 2. Functional e2e

- [x] 2.1 Add `tests/e2e/dual-pane.spec.ts`: both panes render; editing TS produces a live diagnostic.
- [x] 2.2 Add `tests/e2e/quiz-exercise.spec.ts`: quiz feedback and exercise pass via solution + Check.
- [x] 2.3 Add `tests/e2e/progress.spec.ts`: progress written to `ts-school-progress` survives reload.
- [x] 2.4 Add `tests/e2e/search.spec.ts`: cmd/ctrl+K opens search and navigates to a lesson.
- [x] 2.5 Add `tests/e2e/theme.spec.ts`: theme switch persists across reload.

## 3. A11y and visuals

- [x] 3.1 Add `tests/e2e/a11y.spec.ts` with `@axe-core/playwright` on `/`, `/curriculum`, fixture lesson, `/history` (serious/critical).
- [x] 3.2 Add `tests/e2e/visual.spec.ts` with `toHaveScreenshot` for the same four routes; generate and commit baselines (`--update-snapshots` once).

## 4. Gates and archive

- [x] 4.1 `pnpm build` then `pnpm test:e2e` (Chromium Desktop) passes.
- [x] 4.2 `pnpm lint`, `pnpm typecheck`, and `pnpm test` still pass.
- [x] 4.3 Mark tasks complete; `openspec validate add-e2e-coverage --strict`; archive the change.
