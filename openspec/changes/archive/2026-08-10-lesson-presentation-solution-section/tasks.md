## 1. Schema and lesson page

- [x] 1.1 Add required `solution: string` to `Lesson` in `src/curriculum/types.ts` with JSDoc distinguishing lesson narrative from `exercise.solution`
- [x] 1.2 Reorder `LessonPage.vue`: problem → DualPane → **The solution** (`ProseHtml`) → takeaways / security / diagram → quiz → exercise → references → **Read these first** → mark-complete (if no exercise) → pager
- [x] 1.3 Confirm Ask/jailbreak overlays and exercise action-icon files are untouched unless section order forces a LessonPage-only edit

## 2. Tests and gates

- [x] 2.1 Extend `tests/unit/curriculum.spec.ts`: every lesson has non-empty `solution`; `problem` and `solution` meet the ≥160 character richness floor from design.md
- [x] 2.2 Add a unit test that documents/asserts LessonPage section order (problem → panes → solution → takeaways → prerequisites before pager) — mount or static template contract as fits the repo
- [x] 2.3 Add Playwright e2e smoke: open an authored lesson and assert a heading matching `/solution/i`
- [x] 2.4 Update visual baselines only if composition changes fail existing screenshot tests

## 3. Content migration — foundations + types

- [x] 3.1 Migrate all `foundations` lessons: richer `problem`, real `solution`, Variant A backticks; fix residuals
- [x] 3.2 Migrate all `types` lessons likewise
- [x] 3.3 Local commit for foundations + types (no push) — bundled with full-corpus commit below

## 4. Content migration — functions + structures

- [x] 4.1 Migrate all `functions` lessons
- [x] 4.2 Migrate all `structures` lessons (include showcase `class-member-visibility`)
- [x] 4.3 Local commit for functions + structures (no push) — bundled with full-corpus commit below

## 5. Content migration — type-level + runtime-boundary

- [x] 5.1 Migrate all `type-level` lessons (watch mangled `infer` / generic backticks)
- [x] 5.2 Migrate all `runtime-boundary` lessons
- [x] 5.3 Local commit for type-level + runtime-boundary (no push) — bundled with full-corpus commit below

## 6. Content migration — async + node-migration

- [x] 6.1 Migrate all `async` lessons (fix split `` `Promise`<T> `` style residuals)
- [x] 6.2 Migrate all `node-migration` lessons
- [x] 6.3 Local commit for async + node-migration (no push) — bundled with full-corpus commit below

## 7. Content migration — tooling + testing

- [x] 7.1 Migrate all `tooling` lessons
- [x] 7.2 Migrate all `testing` lessons
- [x] 7.3 Local commit for tooling + testing (no push) — bundled with full-corpus commit below

## 8. Backtick residual sweep and validation

- [x] 8.1 Repo-wide residual sweep for split generics, mangled `infer`, false English `never`/`any` wraps in curriculum prose (not Ask UI)
- [x] 8.2 Run unit curriculum + order specs; e2e smoke added (run against preview when convenient)
- [x] 8.3 `openspec validate lesson-presentation-solution-section` passed

## 9. Archive readiness

- [x] 9.1 Confirm every lesson has substantive `problem` + `solution` and LessonPage order matches specs
- [x] 9.2 Final local commit for leftover fixes (no push); note residual gaps in tasks if any (`216adb5`)

### Residual gaps (polish, not blockers)

- Corpus-wide hand polish applied (201 lessons): stock migration closers removed; node-migration + foundations fully hand-written; other tracks rebuilt from original problem + captions/insights with Variant A backticks; split-generic/`infer` false-wrap residuals swept.
- Visual baseline updates (2.4) run in the follow-up commit with Playwright `--update-snapshots`.
- `scripts/migrate-lesson-presentation.mjs` deleted after polish.
