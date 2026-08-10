# learner-features Specification

## Purpose

Persists learner progress in a versioned localStorage schema, renders authored
quizzes and solution-match exercises on lesson pages, and surfaces track
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

### Requirement: exercise block validated by solution-match

When a lesson authors an `exercise`, the lesson page MUST render the prompt and
an editable editor seeded with `starter`. Learner **Check** MUST pass when
normalized editor text equals the authored `solution` (CRLF normalized, trim),
as specified by `build-time-diagnostics`. Check MUST NOT require live compiler
output. The UI MUST disclose that Check compares to the authored solution and
that any diagnostics shown are build-time Strada snapshots. On pass, the
progress store MUST record the exercise as passed. The authored `assertion`
field remains for compiler-truth / CI validation of `solution`, not for learner
Check.

#### Scenario: matching the solution passes

- **GIVEN** an exercise with an authored `solution`
- **WHEN** the learner pastes that solution (modulo normalized whitespace) and
  activates Check
- **THEN** the exercise is marked passed and progress records the pass

#### Scenario: non-matching attempt fails Check

- **GIVEN** an exercise with an authored `solution`
- **WHEN** the learner's editor text does not match the solution after
  normalization and they activate Check
- **THEN** the exercise is not marked passed

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
using the Strada Compiler API (`typescript-strada@6.0.3`), consistent with
`build-time-diagnostics`. Lessons without an exercise or without a solution
MUST NOT fail for that reason.

#### Scenario: solution satisfies no-errors

- **GIVEN** an authored exercise with a solution and `assertion: "no-errors"`
- **WHEN** the compiler-truth suite runs
- **THEN** checking the solution yields zero diagnostics

### Requirement: Exercise Check remains solution-match

Learner-facing Check MUST continue to pass via normalized solution-match against the authored solution; compiler assertions remain a CI / compiler-truth concern.

#### Scenario: Fail path
- **WHEN** a learner submits exercise code that does not match the solution
- **THEN** Check reports failure without implying a live typecheck ran in the browser

### Requirement: Progress store remains the single source for Profile and AI

Learner progress MUST continue to persist only under `ts-school-progress` with schema validation as already specified. Profile summaries, export payloads, clear-all, and AI progress context MUST read and mutate that same store — the system MUST NOT introduce a second progress schema or duplicate lesson-completion flags.

#### Scenario: Profile completion matches curriculum meters

- **GIVEN** a learner with completed lessons recorded in the progress store
- **WHEN** Profile and the curriculum map both render
- **THEN** completion counts for a track agree between Profile and the curriculum `VdProgress` meters

#### Scenario: Clear all empties the progress store

- **GIVEN** lessons marked complete in the progress store
- **WHEN** Clear all is confirmed on Profile
- **THEN** the progress store hydrates as empty and curriculum meters show zero

