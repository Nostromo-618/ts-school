## MODIFIED Requirements

### Requirement: compiler-truth suite over authored lessons

CI MUST run the real TypeScript 6.0.3 compiler over every lesson whose
TypeScript pane is authored (not a placeholder) and assert that the compiler's
diagnostics match that pane's `expectedDiagnostics` via the shared matcher. A
lesson whose TypeScript pane is a placeholder MUST be skipped by the suite so
unfinished taxonomy stubs do not fail CI. An authored pane that claims an empty
diagnostic list MUST pass only when the compiler reports none. After the
`author-intermediate-tier` change, every lesson with `tier === "intermediate"`
MUST be authored (non-placeholder) and MUST be checked by the suite.

#### Scenario: authored expectation matches the compiler

- **GIVEN** an authored lesson whose `expectedDiagnostics` describes a real
  compiler diagnostic
- **WHEN** the compiler-truth suite runs
- **THEN** the suite passes for that lesson

#### Scenario: placeholder lessons are skipped

- **GIVEN** a lesson whose TS pane is a placeholder
- **WHEN** the compiler-truth suite runs
- **THEN** that lesson is skipped and does not fail the suite

#### Scenario: authored empty expectations require silence

- **GIVEN** an authored TS pane with `expectedDiagnostics: []`
- **WHEN** the compiler-truth suite runs
- **THEN** the suite fails if the compiler reports any diagnostic for that
  source

#### Scenario: intermediate tier has no placeholders

- **GIVEN** the curriculum after intermediate authoring
- **WHEN** intermediate lessons are inventoried for the compiler-truth suite
- **THEN** every intermediate lesson is authored (non-placeholder) and checked
