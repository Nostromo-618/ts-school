# learner-features Specification

## Purpose

Persists learner progress in a versioned localStorage schema, renders authored
quizzes and compiler-validated exercises on lesson pages, and surfaces track
completion meters on the curriculum map.

## Requirements

### Requirement: versioned schema-validated progress store

The system MUST persist learner progress under the localStorage key
`ts-school-progress`. Stored payloads MUST carry a numeric schema `version`. On
read, the store MUST validate the payload against the current schema; unknown,
corrupt, or wrong-version shapes MUST be discarded and treated as empty
progress — never trusted. Progress SHALL track per-lesson status
(`in-progress` | `complete`), quiz scores, and exercise pass flags. Persistence
MUST be client-only and MUST NOT use vite-ssg `initialState`.

#### Scenario: valid payload round-trips

- **GIVEN** a progress payload matching the current schema version
- **WHEN** it is written to and read from localStorage
- **THEN** lesson statuses, quiz scores, and exercise passes are restored

#### Scenario: corrupt payload is discarded

- **GIVEN** localStorage contains a non-object, wrong version, or otherwise
  invalid progress payload
- **WHEN** the store hydrates
- **THEN** progress is empty and the invalid payload is not applied

### Requirement: quiz block with instant feedback

When a lesson authors a `quiz` array, the lesson page MUST render those
questions. Choosing an answer SHALL show immediate feedback using the authored
explanation. Correct and incorrect outcomes MUST be distinguishable. A completed
quiz score MUST be recorded in the progress store.

#### Scenario: correct answer shows explanation

- **GIVEN** a lesson with a quiz question
- **WHEN** the learner selects the correct choice
- **THEN** the explanation is shown and the choice is marked correct

#### Scenario: quiz score is persisted

- **GIVEN** a learner who has answered every question in a lesson quiz
- **WHEN** the quiz is complete
- **THEN** the progress store records the score for that lesson

### Requirement: exercise block validated through the worker

When a lesson authors an `exercise`, the lesson page MUST render the prompt and
an editable editor seeded with `starter`. The attempt MUST pass when the live
typecheck diagnostics match the authored assertion: `"no-errors"` means zero
diagnostics; an `ExpectedDiagnostic[]` means `matchesExpected` succeeds. On
pass, the progress store MUST record the exercise as passed.

#### Scenario: no-errors assertion passes on silence

- **GIVEN** an exercise with `assertion: "no-errors"`
- **WHEN** the learner's code produces no diagnostics
- **THEN** the exercise is marked passed

#### Scenario: expected-diagnostic assertion uses the matcher

- **GIVEN** an exercise whose assertion is a specific expected diagnostic set
- **WHEN** the worker diagnostics match that set via `matchesExpected`
- **THEN** the exercise is marked passed

### Requirement: lesson completion wiring

The lesson page MUST let a learner mark a lesson complete, and MUST treat a
passing quiz (when present) and a passing exercise (when present) as completion
signals. Visiting or interacting with a lesson MAY mark it `in-progress` until
complete.

#### Scenario: explicit mark complete

- **GIVEN** an open lesson
- **WHEN** the learner activates mark-complete
- **THEN** the progress store records that lesson as complete

### Requirement: curriculum progress meters

The curriculum map MUST show a `VdProgress` meter per visible track, reflecting
how many of that track's lessons the learner has completed according to the
progress store. Tracks with zero completions MUST still render a zero meter.

#### Scenario: track meter reflects completions

- **GIVEN** a track with 10 lessons of which the learner has completed 4
- **WHEN** the curriculum map renders that track
- **THEN** its progress meter shows 4 of 10 complete

### Requirement: exercise solutions in compiler-truth

When an authored lesson includes an exercise with a `solution` string, the
compiler-truth suite MUST check that solution against the exercise assertion
using the real TypeScript 6.0.3 compiler. Lessons without an exercise or without
a solution MUST NOT fail for that reason.

#### Scenario: solution satisfies no-errors

- **GIVEN** an authored exercise with a solution and `assertion: "no-errors"`
- **WHEN** the compiler-truth suite runs
- **THEN** checking the solution yields zero diagnostics
