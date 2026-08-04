## Why

The lesson engine can teach, but nothing remembers what the learner finished,
and authored quizzes / exercises have nowhere to render. Progress must survive
reloads on a static site (localStorage only — no server), and exercise pass/fail
must go through the same compiler worker that powers the dual pane so the
product stays honest.

## What Changes

- Add `src/stores/progress.ts`: Pinia store persisted under localStorage key
  `ts-school-progress`, **versioned and schema-validated on read** (unknown
  shapes discarded). Tracks per-lesson status (complete / in-progress), quiz
  scores, and exercise passes.
- Add `src/components/lesson/QuizBlock.vue`: renders authored `quiz` questions
  with instant feedback; records scores in the progress store.
- Add `src/components/lesson/ExerciseBlock.vue`: starter code in a
  `VdCodeEditor`, pass when worker diagnostics match the authored assertion
  (`"no-errors"` or an `ExpectedDiagnostic[]`) via `matchesExpected`.
- Wire LessonPage: show QuizBlock / ExerciseBlock when present; allow marking a
  lesson complete (quiz/exercise pass or explicit mark).
- Wire curriculum map: fill the existing progress seam with `VdProgress` meters
  per track from the progress store.
- Extend the compiler-truth suite to assert exercise `solution` strings (when
  present) against `exercise.assertion` for authored lessons.

Routes: none added or removed. Curriculum and lesson routes unchanged.

## Non-goals

- **NO lesson content authoring** — quizzes and exercises arrive with content
  tiers; this change only renders them when present.
- **NO server-side accounts, sync, or cloud progress**.
- **NO Playwright e2e** — `add-e2e-coverage` owns those flows.
- **NO `/history` or `/about` edits** — sibling agent territory.
- **NO changes to the typecheck worker API** beyond consuming it.

## Capabilities

### New Capabilities

- `learner-features`: versioned progress persistence, quiz and exercise UI,
  curriculum progress meters, and exercise solution compiler-truth checks.

### Modified Capabilities

- `lesson-engine`: LessonPage gains optional quiz / exercise / mark-complete
  controls when learner features are present (additive composition only).

## Impact

- New `src/stores/progress.ts`, quiz/exercise components, curriculum.vue
  progress seam fill, LessonPage wiring, progress-store unit tests, compiler-
  truth extension for exercise solutions.
- localStorage is client-only; SSG remains CSP-clean (no `initialState`).
