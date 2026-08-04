# lesson-engine Specification

## Purpose

Renders every curriculum lesson as a live JS-vs-TS dual pane backed by the
in-browser typecheck worker, with prerendered diagnostic fallback for SSG and a
CI compiler-truth suite that refuses authored diagnostic claims the real
TypeScript 6.0.3 compiler does not produce.

## Requirements

### Requirement: dual-pane JS and TS editors

The lesson page MUST present the lesson's JavaScript pane and TypeScript pane
together. On viewports wide enough for side-by-side layout the panes SHALL
appear adjacent (JS left, TS right). On narrow viewports the panes SHALL be
reachable through tabs. The JavaScript pane MUST be read-only. The TypeScript
pane MUST be editable. Lesson source MUST reach the DOM only as plain text —
never via `v-html`, `innerHTML`, or equivalent HTML injection.

#### Scenario: authored lesson shows both panes

- **GIVEN** a lesson whose JS and TS panes are authored (not placeholders)
- **WHEN** the learner opens that lesson
- **THEN** both panes render their authored source, the JS pane cannot be
  edited, and the TS pane accepts edits

#### Scenario: mobile uses tabs

- **GIVEN** a viewport too narrow for side-by-side panes
- **WHEN** the learner opens a lesson
- **THEN** JavaScript and TypeScript are available as separate tabs and each
  tab shows the corresponding pane

### Requirement: live diagnostics beneath the TypeScript pane

While the TypeScript pane is live-checked, the page MUST show the compiler's
diagnostics beneath that pane. Each entry SHALL display the 1-based line and
column, the TypeScript error code, and the message. Messages that contain
newlines MUST preserve those newlines visually (`white-space: pre-wrap` or
equivalent) and MUST NOT be interpreted as HTML. Selecting an entry SHALL move
focus into the TypeScript editor at that line. The page MUST NOT invent a
gutter-marker API that the code editor does not provide.

#### Scenario: a type error appears under the editor

- **GIVEN** an authored lesson whose TS source produces a diagnostic
- **WHEN** the live checker reports that diagnostic
- **THEN** the list beneath the TS pane shows its line, column, code, and
  message

#### Scenario: jump-to-line focuses the editor

- **GIVEN** a diagnostic listed beneath the TS pane
- **WHEN** the learner activates its jump control
- **THEN** the TypeScript editor receives focus at the diagnostic's line

### Requirement: prerendered expected diagnostics as fallback

During SSG prerender and before the first live worker response, the diagnostics
list MUST be seeded from the lesson's authored `expectedDiagnostics` so the
page is meaningful without JavaScript. After the worker answers, live
diagnostics MUST replace that fallback.

#### Scenario: SSG page shows authored expectations

- **GIVEN** a lesson with non-empty `expectedDiagnostics`
- **WHEN** the lesson HTML is prerendered
- **THEN** those expectations appear in the diagnostics region of the HTML

#### Scenario: live results replace the fallback

- **GIVEN** a hydrated lesson whose worker has answered
- **WHEN** the learner views the diagnostics list
- **THEN** the entries reflect the worker's `TsDiagnostic`s, not only the
  prerendered expectations

### Requirement: stub lessons render gracefully

A lesson whose TypeScript pane is still a placeholder MUST still render its
title, tier, track, summary, and problem. Placeholder panes MAY be shown as
placeholder source. The page MUST NOT start live type checking for a
placeholder TypeScript pane. The page MUST NOT treat unfinished content as a
hard error.

#### Scenario: placeholder lesson stays readable

- **GIVEN** a lesson whose TS pane contains the placeholder marker
- **WHEN** the learner opens that lesson
- **THEN** title, tier, track, summary, and problem are visible and no live
  typecheck worker is started for that pane

### Requirement: lesson page composition

One lesson route component MUST render every lesson: breadcrumbs, title, tier
badge, track label, summary, problem, dual pane, insight bullets when present,
an optional security note when present, an optional flowchart when diagram data
is present, optional quiz and exercise blocks when authored, a mark-complete
control, and previous/next navigation. Missing optional fields MUST be omitted
without error.

#### Scenario: insights and security note render when authored

- **GIVEN** a lesson with non-empty `insight` and a `security` note
- **WHEN** the page renders
- **THEN** each insight appears as a list item and the security note shows its
  title, body, and severity

#### Scenario: absent diagram is omitted

- **GIVEN** a lesson with no `diagram`
- **WHEN** the page renders
- **THEN** no flowchart region is shown and the page does not error

#### Scenario: quiz and exercise render when authored

- **GIVEN** a lesson with both `quiz` and `exercise`
- **WHEN** the page renders
- **THEN** both blocks are shown beneath the dual pane

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
