# Change: Content quality overhaul

## Why

After the TypeScript 7 + build-time diagnostics migration, product copy, UX
labels, OpenSpec requirements, and a handful of meta-lessons still describe a
live in-browser worker. Learners meet editable panes with frozen diagnostics and
exercises that pass via solution-match — those behaviors must be named honestly.
Encoding corruption and a few misfit lessons undermine trust. Intermediate-tier
interactivity and enrichment are addressed for a first batch, with remaining
gaps left as later milestones.

## What Changes

### Waves 0–3 (this change)

**Wave 0 — Truth and trust**

- Rewrite supporting surfaces (about, history, home, footer, router meta,
  curriculum) for build-time Strada diagnostics + solution-match exercises.
- Disclose static diagnostics and solution-match in lesson UI; rename
  `LiveTsPane` → `EditableTsPane`; clarify exercise `assertion` JSDoc
  (CI / compiler-truth vs learner Check).
- Repair UTF-8 mojibake in lesson sources and add a CI encoding guard.
- Align OpenSpec main specs with `build-time-diagnostics` (this artifact plus
  the listed spec updates).

**Wave 1 — Lesson truth**

- Rewrite stale TS6 / Web Worker architecture claims in foundations, tooling,
  and node-migration meta-lessons.
- Fix `runtime-boundary` track order (`unknown-vs-any` before
  `where-types-end`).
- Fix misfit pedagogy (CFA invalidation, variance starter, `in` narrowing,
  any/implicit-any exercise honesty).
- Standardize empty-diagnostic captions where silence is the teaching point;
  regenerate diagnostics and update visual baselines as needed.

**Wave 2 — Intermediate interactivity (first batch of 12)**

Add quiz and/or exercise (with solution) to twelve high-leverage intermediate
lessons; leave the remaining intermediate gaps as a later milestone.

**Wave 3 — Enrichment**

First flowcharts, async glossary + assignability discoverability, security notes
outside runtime-boundary, and highlight-vs-diagnostic line audit.

Routes: none added or removed. Curriculum lesson routes unchanged.

## Non-goals

- Restoring live-as-you-type checking in the browser
- Filling all ~82 intermediate quiz/exercise gaps in one change
- Catalog-maxing vd3 components
- Deploy / hosting changes
- Reintroducing a typecheck Web Worker or shipping a compiler in the browser
  bundle

## Capabilities

### Modified Capabilities

- `supporting-pages`: about/history narrative matches dual install + build-time
  Strada (no in-browser checker pin story).
- `learner-features`: exercise Check is solution-match; assertion remains for
  compiler-truth / CI.
- `lesson-engine`: static diagnostics from the generated map; no live worker.
- `e2e-coverage`: dual-pane and exercise scenarios assert static diagnostics and
  solution-match.
- `intermediate-curriculum` / `beginner-curriculum`: host language refers to
  Strada / build-time diagnostics, not a runtime worker.

## Impact

- Specs: rewrite stale worker / live-checker requirements; keep progress, quiz,
  composition, and compiler-truth requirements that remain true.
- Code (Waves 0–1): supporting copy, lesson UX disclosure, mojibake repair,
  meta-lesson and misfit fixes — verified via compiler-truth, diagnostics
  `--check`, e2e / visual baselines, and a grep gate against stale product
  claims.
