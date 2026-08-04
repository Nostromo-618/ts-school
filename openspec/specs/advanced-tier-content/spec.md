## Purpose

Defines the authored-content contract for every advanced-tier TypeScript School
lesson: dual panes that teach against real compiler output, quizzes, exercises,
insights, and security notes where the topic warrants them.

## Requirements

### Requirement: every advanced lesson is fully authored

Every lesson whose `tier` is `"advanced"` MUST replace placeholder panes with
authored JavaScript and TypeScript source. Neither pane MUST contain the
placeholder marker. Each lesson MUST include at least one insight bullet, a
quiz with at least one question, and an exercise with a `solution` that
satisfies the exercise assertion.

#### Scenario: inventory has no advanced stubs

- **GIVEN** the registered curriculum
- **WHEN** every lesson with `tier === "advanced"` is inspected
- **THEN** neither its JS nor its TS pane contains the placeholder marker, and
  each has non-empty `insight`, a `quiz`, and an `exercise` with a `solution`

#### Scenario: beginner and intermediate stubs may remain

- **GIVEN** a lesson whose `tier` is `"beginner"` or `"intermediate"`
- **WHEN** this change is applied
- **THEN** that lesson MAY still use placeholder panes (owned by sibling
  changes) and MUST NOT be edited solely to satisfy advanced authoring

### Requirement: compiler-truth for advanced panes and solutions

For every advanced lesson, the TypeScript pane's `expectedDiagnostics` MUST
match the diagnostics TypeScript 6.0.3 reports for that pane's source under the
site's typecheck host. When an exercise provides a `solution`, that solution
MUST satisfy the exercise `assertion` under the same host.

#### Scenario: authored pane matches real tsc

- **GIVEN** an advanced lesson with authored panes
- **WHEN** the compiler-truth suite type-checks `lesson.ts.code`
- **THEN** `matchesExpected(actual, lesson.ts.expectedDiagnostics)` succeeds

#### Scenario: exercise solution satisfies its assertion

- **GIVEN** an advanced lesson with `exercise.solution`
- **WHEN** the compiler-truth suite type-checks that solution
- **THEN** the result satisfies `exercise.assertion` (`"no-errors"` or the
  authored diagnostic set)

### Requirement: JS-vs-TS pairing at advanced depth

Every advanced lesson MUST present idiomatic-but-fragile JavaScript (or the
incomplete mental model the topic replaces) beside TypeScript that makes the
failure mode visible to the checker or structures the correct approach. The
pair MUST teach the lesson's `problem` statement rather than unrelated syntax.

#### Scenario: the pair illustrates the problem

- **GIVEN** an advanced lesson's `problem`, `js`, and `ts` panes
- **WHEN** a learner reads both panes
- **THEN** the JavaScript side shows the failure mode or incomplete model named
  by `problem`, and the TypeScript side shows how types catch, brand, or
  structure the fix

### Requirement: security notes where trust boundaries appear

Advanced lessons whose topic involves validated data, deserialization,
declaration soundness, dual packages, or other trust boundaries MUST include a
`security` note with a severity of `info`, `caution`, or `critical`. Lessons
that are purely about checker mechanics without a trust boundary MAY omit it.

#### Scenario: branded validated types carry a security note

- **GIVEN** the `branded-validated-types` lesson
- **WHEN** its authored content is loaded
- **THEN** a `security` note is present explaining why unvalidated construction
  of a branded value is a trust failure

#### Scenario: pure inference lessons may omit security

- **GIVEN** a lesson such as `infer-keyword` or `generic-inference-internals`
- **WHEN** its authored content is loaded
- **THEN** a `security` note MAY be absent
