## Why

The product surface — dual-pane lessons, quizzes, exercises, progress,
search, and theme — is complete across all three tiers, but nothing exercises
it in a real browser against the built site and CSP. Without Playwright e2e,
a11y smoke, and visual baselines, regressions in the learner flows and shell
ship unnoticed.

## What Changes

- Add Playwright specs under `tests/e2e/` covering dual-pane live diagnostics,
  quiz and exercise flows, progress persistence across reload, cmd+K / global
  search navigation, and theme persistence.
- Add `@axe-core/playwright` accessibility smoke against home, curriculum, one
  lesson, and history.
- Commit Chromium Desktop visual baselines for those same key pages.
- No application routes, lessons, or security posture changes — test-only.

## Non-goals

- **NO** cross-browser matrix as a required gate — `pnpm test:e2e` stays
  Chromium Desktop; `test:e2e:full` already exists for optional full matrix.
- **NO** lesson content authorship or OpenSpec curriculum archive edits.
- **NO** CSP weakening, `eval`, `v-html`, or runtime network exceptions.
- **NO** deploy workflow, GitHub Pages, or remote hosting.
- **NO** TypeScript upgrade; 6.0.3 stays pinned.
- **NO** unit-test replacement — Vitest and the compiler-truth suite remain
  the content correctness gates.

## Capabilities

### New Capabilities

- `e2e-coverage`: browser-level acceptance of dual-pane diagnostics, quiz and
  exercise flows, progress and theme persistence, global search navigation,
  axe a11y smoke, and committed visual baselines on the prerendered site.

### Modified Capabilities

_None — existing lesson-engine, learner-features, and docs-shell requirements
are unchanged; this change only adds end-to-end verification of those
behaviours._

## Impact

- `tests/e2e/**` (new), Playwright snapshot directories under
  `tests/e2e/**/*-snapshots/` (or Playwright's default beside specs).
- `playwright.config.ts` already targets `vite preview` on port 8787 after
  build — e2e must run against that surface (match existing config).
- DevDependency `@axe-core/playwright` is already present; may need
  `playwright install` for Chromium.
- CI / local gates: `pnpm test:e2e` (Chromium Desktop) after `pnpm build`.
