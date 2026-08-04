# Tasks

## 1. Progress store

- [x] 1.1 Add `src/stores/progress.ts`: schema v1, validate-on-read,
      localStorage key `ts-school-progress`, actions for hydrate, mark
      in-progress/complete, record quiz score, record exercise pass, track
      completion counts.
- [x] 1.2 Hydrate from `App.vue` onMounted (client only).
- [x] 1.3 Add `tests/unit/progress-store.spec.ts` covering round-trip, corrupt
      discard, wrong version discard.

## 2. Quiz and exercise UI

- [x] 2.1 Add `QuizBlock.vue` with instant feedback and progress recording.
- [x] 2.2 Add `ExerciseBlock.vue` validated via `useTypecheck` +
      `matchesExpected` / no-errors.
- [x] 2.3 Wire both into `LessonPage.vue` plus mark-complete and in-progress
      on visit.

## 3. Curriculum meters

- [x] 3.1 Fill the `VdProgress` seam in `curriculum.vue` from the progress
      store.

## 4. Compiler-truth extension

- [x] 4.1 Extend `compiler-truth.spec.ts` to assert exercise solutions when
      present.

## 5. Gates

- [x] 5.1 `pnpm lint`, `stylelint`, `format:check`, `typecheck`, `test`,
      `build` all pass.
- [x] 5.2 Archive `add-learner-features` after validate --strict.
