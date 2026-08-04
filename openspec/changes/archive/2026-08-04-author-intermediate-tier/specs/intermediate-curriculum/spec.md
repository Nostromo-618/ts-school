## Purpose

Defines the authored intermediate-tier curriculum: every lesson with
`tier === "intermediate"` MUST ship real JS/TS panes, accurate compiler
diagnostics, and security-aware runtime-boundary teaching for Node developers.

## ADDED Requirements

### Requirement: every intermediate lesson is authored

Every curriculum lesson whose `tier` is `"intermediate"` MUST replace
placeholder panes with authored JavaScript and TypeScript source. Neither pane
MUST contain the placeholder marker. The lesson MUST retain its registered id,
title, tier, track, order, summary, prerequisites, and keywords.

#### Scenario: intermediate inventory has no placeholders

- **GIVEN** the curriculum registry after this change
- **WHEN** every lesson with `tier === "intermediate"` is inspected
- **THEN** both `js` and `ts` panes are non-placeholder authored source

#### Scenario: taxonomy identity is preserved

- **GIVEN** an intermediate lesson registered by the taxonomy
- **WHEN** its content is authored
- **THEN** its id, tier, track, order, and prerequisite edges are unchanged

### Requirement: compiler-truth for intermediate panes

Each authored intermediate TypeScript pane MUST declare `expectedDiagnostics`
that match real TypeScript 6.0.3 output under the project's typecheck host
baseline. An empty `expectedDiagnostics` array MUST mean the compiler is
silent on that pane. When an exercise solution is present, it MUST satisfy the
exercise assertion under the same host.

#### Scenario: intermediate panes pass compiler-truth

- **GIVEN** every intermediate lesson's TypeScript pane
- **WHEN** the compiler-truth suite runs real TypeScript 6.0.3
- **THEN** each pane's diagnostics match its `expectedDiagnostics`

#### Scenario: exercise solutions satisfy assertions

- **GIVEN** an intermediate lesson that includes `exercise.solution`
- **WHEN** the suite typechecks that solution
- **THEN** the result satisfies `exercise.assertion`

### Requirement: dual-pane teaching pairs

Each intermediate lesson MUST present idiomatic-but-fragile JavaScript on the
left and TypeScript that addresses the problem on the right. Captions and
highlights MUST point at the teaching moment. Insight bullets MUST state the
takeaway in plain language aimed at working Node.js developers.

#### Scenario: JS problem and TS fix are paired

- **GIVEN** an authored intermediate lesson
- **WHEN** a learner opens it
- **THEN** the JS pane illustrates the problem stated in `problem` and the TS
  pane shows the typed remedy with matching insights

### Requirement: runtime-boundary security notes

Every intermediate lesson on the `runtime-boundary` track MUST include a
`security` note. The note MUST explain why untrusted input cannot be trusted
on type annotations alone and MUST use severity `"info"`, `"caution"`, or
`"critical"` appropriately. Lessons on other tracks MAY include a security
note when the topic involves untrusted data.

#### Scenario: runtime-boundary lessons carry security

- **GIVEN** an intermediate lesson with `track === "runtime-boundary"`
- **WHEN** the lesson is rendered
- **THEN** a `security` note is present with title, body, and severity

### Requirement: node-migration ambient stubs

Intermediate `node-migration` lessons MUST teach Node patterns (CJS→ESM,
`node:*`, env, streams, fs, HTTP, CLI, buffers, event emitters) using
self-contained snippets. Because the in-browser host has no `@types/node`,
lessons MUST supply minimal ambient declarations or declare modules inside the
snippet when Node APIs are referenced, rather than importing real Node types
from the filesystem.

#### Scenario: node snippet typechecks without @types/node

- **GIVEN** an intermediate node-migration TypeScript pane that references a
  Node API
- **WHEN** the typecheck host runs without package `@types`
- **THEN** the pane either uses ambient stubs in-source or produces only the
  authored expected diagnostics

### Requirement: quizzes and exercises where they teach

Intermediate lessons SHOULD include a quiz and/or exercise when the concept
benefits from active practice. Quizzes MUST use single-answer multiple choice
with explanations. Exercises MUST provide starter code and an assertion the
worker can verify. Lessons MAY omit quiz/exercise when the dual-pane pair is
sufficient.

#### Scenario: quiz has one correct answer and explanation

- **GIVEN** an intermediate lesson with a quiz
- **WHEN** the learner answers
- **THEN** feedback uses the authored `answerId` and `explanation`

#### Scenario: exercise starter is intentionally incomplete

- **GIVEN** an intermediate lesson with an exercise
- **WHEN** the starter is typechecked
- **THEN** it does not already satisfy a `"no-errors"` assertion unless the
  exercise is specifically about confirming silence
