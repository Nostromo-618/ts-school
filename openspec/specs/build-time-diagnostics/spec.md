# build-time-diagnostics Specification

## Purpose
Produce real TypeScript diagnostics for authored lesson panes and exercise
strings at build time with the Strada Compiler API, ship them as static data,
and keep the browser free of any compiler import.

## Requirements

### Requirement: dual TypeScript install

The repository MUST declare `typescript` at 7.0.2 (native CLI) and
`typescript-strada` as `npm:typescript@6.0.3` for the programmatic
`createProgram` API. Browser source MUST NOT value-import either package.

#### Scenario: versions are detectable

- **GIVEN** `package.json` and `node_modules`
- **WHEN** the versions are read
- **THEN** `typescript` reports 7.0.2 and `typescript-strada` reports 6.0.3

#### Scenario: browser source stays compiler-free

- **GIVEN** the `src/` tree
- **WHEN** every module is inspected for imports of `typescript` or
  `typescript-strada`
- **THEN** no value imports exist; `src/typecheck/host.ts` may type-only import
  `typescript-strada`

### Requirement: generated diagnostics map

`scripts/generate-diagnostics.mjs` MUST run Strada over every non-placeholder
lesson `ts.code` (and exercise starter/solution when present) and write
`src/curriculum/generated/diagnostics.ts`. `predev` and `prebuild` MUST
regenerate it; `pretest` MUST `--check` that it is not stale.

#### Scenario: generator covers authored lessons

- **GIVEN** the curriculum registry
- **WHEN** the generator runs
- **THEN** every non-placeholder lesson id appears in `LESSON_DIAGNOSTICS` with
  a `pane` array matching live Strada output for that lesson's `ts.code`

#### Scenario: stale map fails CI

- **GIVEN** a diagnostics file that would change if regenerated
- **WHEN** `node scripts/generate-diagnostics.mjs --check` runs
- **THEN** the process exits non-zero

### Requirement: UI shows static diagnostics

Lesson dual panes and exercise blocks MUST render diagnostics from the generated
map (falling back to prerendered `expectedDiagnostics` only if a map entry is
missing). They MUST NOT construct a Web Worker or call a live typecheck client.

#### Scenario: fixture lesson shows TS2345

- **GIVEN** the learner opens `/lessons/foundations/first-type-error`
- **WHEN** the dual-pane diagnostics region is visible
- **THEN** it includes `TS2345` from the generated pane diagnostics

### Requirement: exercise solution-match

Exercise **Check** MUST pass when normalized editor text equals the authored
`solution` (CRLF normalized, trim). It MUST NOT require live compiler output.

#### Scenario: filling the solution and checking passes

- **GIVEN** an exercise with an authored solution
- **WHEN** the learner pastes that solution and clicks Check
- **THEN** the UI reports the exercise passed and progress records the pass

### Requirement: compiler-truth still uses Strada

The compiler-truth suite MUST use `typescript-strada` via the virtual host and
assert each lesson's `expectedDiagnostics` match Strada output, and that
generated pane diagnostics equal that output.

#### Scenario: expectation matches Strada

- **GIVEN** an authored lesson pane
- **WHEN** Strada checks `lesson.ts.code`
- **THEN** `matchesExpected(actual, lesson.ts.expectedDiagnostics)` is true
