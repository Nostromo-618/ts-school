## Why

TypeScript School needs a strict release-readiness quality gate before it can be treated as shippable: content must match the TS 7 + build-time Strada architecture, critical learner/AI flows need automated coverage, licenses and AI risk disclosure must be explicit, and shell UX (navbar frost, a11y/responsive) must meet the bar.

## What Changes

- Absorb and finish `content-quality-overhaul` waves 0–3 (truth/trust copy, lesson truth, first 12 intermediate quizzes/exercises, enrichment).
- Add a versioned mandatory AI risk modal when opening the Ask / AI chat sidebar (accept unlocks chat; decline closes).
- Add root MIT `LICENSE` and `THIRD-PARTY-NOTICES.md`; link from README, About, and Terms.
- Strengthen navbar glass frost via site CSS overrides (not fully transparent).
- Expand Playwright/Vitest critical-path coverage; add `pnpm gate:release` and wire Playwright into CI.
- Update README with release checklist, security/AI docs, and remaining content milestones.
- Routes: none added or removed. Lesson routes unchanged; content inside existing lessons may gain quizzes/exercises.

## Non-goals

- Literal Vitest line-coverage thresholds (e.g. 90%+)
- Filling all ~82 intermediate quiz/exercise gaps
- Restoring in-browser live typecheck / Web Worker compiler
- Publishing `@vanduo-oss/vdl-engines` or adding a public deploy host
- Making opt-in LLM e2e (`test:e2e:llm`) a required CI job

## Capabilities

### New Capabilities

- `ai-risk-disclaimer`: Versioned mandatory AI risk gate on chat open (storage, modal UX, accept/decline).
- `release-gate`: Release script, CI Playwright inclusion, LICENSE/THIRD-PARTY notices, navbar frost strength, critical-path test inventory.

### Modified Capabilities

- `supporting-pages`: About/home/history/terms copy aligned with build-time Strada; license + AI risk links.
- `lesson-engine` / `learner-features`: Static diagnostics + solution-match honesty; enrichment hooks where applicable.
- `e2e-coverage`: AI risk modal, XSS markdown, AI edit Accept/Reject, glossary/about/terms/farewell axe, mobile responsive smoke, static-diagnostics edit invariance.
- `beginner-curriculum` / `intermediate-curriculum`: Lesson truth fixes; first batch of 12 intermediate interactivity additions; stale-phrase guard.
- `docs-shell`: Stronger navbar glass frost via site CSS token overrides.

## Impact

- Content: many lesson modules under `src/curriculum/lessons/`; supporting pages; glossary/history data.
- AI: new content/lib/composable/overlay; `aiChat` store / `App.vue` / `TsAiChatSidebar.vue` wiring.
- Tests: new unit + e2e specs; `package.json` scripts; `.github/workflows/ci.yml`.
- Docs: README, LICENSE, THIRD-PARTY-NOTICES.md.
- Visual baselines may update for navbar frost and content layout.
