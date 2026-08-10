# beginner-curriculum Specification

## Purpose

Defines the beginner-tier curriculum content contract: every beginner lesson
MUST ship real JS-vs-TS teaching pairs that the compiler-truth suite can
validate, with insights and optional security, quiz, and exercise material
appropriate for Node.js JavaScript developers migrating to TypeScript.
## Requirements
### Requirement: Every beginner lesson is fully authored

Every lesson whose `tier` is `"beginner"` MUST replace placeholder panes with
authored JavaScript and TypeScript source. After authoring, `isPlaceholder`
MUST be false for both panes. The beginner tier MUST leave zero placeholder
lessons.

#### Scenario: Beginner inventory has no stubs

- **GIVEN** the curriculum registry after this change
- **WHEN** every lesson with `tier === "beginner"` is inspected
- **THEN** neither the JavaScript nor the TypeScript pane contains the
  placeholder marker, and each pane has a non-empty caption

#### Scenario: Intermediate and advanced stay untouched

- **GIVEN** a lesson whose `tier` is `"intermediate"` or `"advanced"`
- **WHEN** this change is applied
- **THEN** that lesson's module body is not required to be authored by this
  change and MAY remain a placeholder

### Requirement: Compiler-truth for beginner panes and exercise solutions

Every beginner lesson's TypeScript pane MUST declare `expectedDiagnostics` that
match real TypeScript 6.0.3 (Strada) output under the site's virtual typecheck
host (`matchesExpected`: code, line, optional `messageIncludes`), consistent
with `build-time-diagnostics`. When a beginner lesson includes an `exercise`
with a `solution`, that solution MUST satisfy the exercise `assertion`
(`"no-errors"` or an expected diagnostic set) under the same host for CI.
Learner-facing Check MUST use normalized solution-match and MUST NOT imply
runtime worker verification.

#### Scenario: Authored TS pane matches tsc

- **GIVEN** a beginner lesson with an authored TypeScript pane
- **WHEN** the compiler-truth suite type-checks that pane with
  `typescript-strada@6.0.3`
- **THEN** `matchesExpected(actual, lesson.ts.expectedDiagnostics)` succeeds

#### Scenario: Exercise solution satisfies assertion

- **GIVEN** a beginner lesson that includes `exercise.solution`
- **WHEN** the compiler-truth suite type-checks that solution
- **THEN** the diagnostics satisfy `exercise.assertion`

### Requirement: Honest JS-vs-TS teaching pairs

Each beginner lesson MUST present idiomatic-but-fragile JavaScript that
illustrates the stated `problem`, and TypeScript that shows how static types
catch or prevent that class of failure. Code MUST be plain strings only — never
HTML. Insights MUST be non-empty. Content pacing MUST stay appropriate for
beginners (Node.js JS-native audience; no advanced type-level machinery).

#### Scenario: Pair illustrates the problem statement

- **GIVEN** a beginner lesson
- **WHEN** a learner reads the JS pane, TS pane, and `problem` text
- **THEN** the JS pane demonstrates the fragile pattern named by `problem`, and
  the TS pane demonstrates the typed counterpart (error and/or fix) described by
  the insights

#### Scenario: Insights are present

- **GIVEN** a beginner lesson
- **WHEN** the lesson is loaded
- **THEN** `insight` contains at least one takeaway string

### Requirement: Optional security, quiz, and exercise where they teach

Beginner lessons MAY include a `security` note when types meet untrusted input
or when `any` / assertions erase safety. Lessons MAY include a `quiz` and/or an
`exercise` with `assertion`, `solution`, and plain-text `starter` for the
editable exercise editor. When present, quiz questions MUST have a correct
`answerId` among their choices. Exercise prompts MUST stay honest that Check
is solution-match (not live compile).

#### Scenario: Security note on a boundary lesson

- **GIVEN** a beginner runtime-boundary or `any`-related lesson that authors a
  `security` field
- **WHEN** the learner opens that lesson
- **THEN** the note's `severity` is one of `info`, `caution`, or `critical`, and
  its body explains a concrete risk (not generic advice)

#### Scenario: Quiz has a valid answer

- **GIVEN** a beginner lesson with a quiz
- **WHEN** each question is validated
- **THEN** `answerId` matches exactly one choice `id`

### Requirement: Meta-lessons match dual-install and build-time diagnostics

Foundations, tooling, and node-migration meta-lessons MUST NOT claim an in-browser TypeScript Web Worker or live `createProgram` from typescript@7. They MUST describe typescript@7 tooling plus typescript-strada@6 (alias of the Strada / TS 6 API line) for build-time diagnostics.

#### Scenario: No live-worker product claim
- **WHEN** a unit stale-phrase gate scans lesson sources
- **THEN** banned phrases implying a live browser typecheck worker fail the suite

### Requirement: Runtime-boundary track order puts unknown-vs-any before where-types-end

The runtime-boundary track order MUST teach `unknown-vs-any` before `where-types-end`.

#### Scenario: Prerequisite order
- **WHEN** the curriculum registry is validated
- **THEN** `unknown-vs-any` appears before `where-types-end` in track order

