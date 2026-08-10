## ADDED Requirements

### Requirement: every lesson carries a solution narrative

Every `Lesson` MUST include a required `solution` string: plain prose (Labs
markdown-lite / backticks allowed) that explains how the TypeScript side
addresses the failure mode named by `problem`. The field MUST NOT carry raw
HTML. Living code examples remain in `js` / `ts` panes; `solution` MAY reference
those panes in prose and MAY include short fenced code blocks when a fragment
outside the panes clarifies the narrative. Integrity tests MUST reject empty or
whitespace-only `solution` values.

#### Scenario: solution is required on the Lesson type

- **GIVEN** the exported `Lesson` interface
- **WHEN** an author omits `solution`
- **THEN** TypeScript reports a compile error

#### Scenario: empty solution fails integrity

- **GIVEN** a registered lesson whose `solution` is empty or whitespace-only
- **WHEN** the curriculum integrity suite runs
- **THEN** that lesson fails the suite

## MODIFIED Requirements

### Requirement: typed lesson model

`src/curriculum/types.ts` MUST define the lesson data model: `Tier`
(`"beginner" | "intermediate" | "advanced"`), `TrackId`, `LessonId`, `CodePane`
(`code`, `highlights`, `caption`), the TypeScript pane variant carrying
`expectedDiagnostics`, `QuizQuestion`, `Exercise`, `Reference`, `SecurityNote`,
`Track`, and `Lesson`. `Lesson` MUST include required prose fields `summary`,
`problem`, and `solution` (plain strings rendered through ProseHtml / Labs
markdown-lite — never raw HTML assigned to the DOM). Every code field
(`js.code`, `ts.code`, exercise starter/solution) SHALL be a plain string; the
model MUST NOT contain a field whose contents are rendered as unescaped HTML.
The module MUST import `ExpectedDiagnostic` from `@/typecheck/types` and MUST
NOT redefine it.

#### Scenario: a lesson author writes a stub

- **GIVEN** the exported `Lesson` interface
- **WHEN** an author declares a lesson with `id`, `title`, `tier`, `track`,
  `order`, `summary`, `prerequisites`, `keywords`, `problem`, `solution`, `js`,
  `ts`, and `insight`
- **THEN** it type-checks without a cast, and omitting any of those fields is a
  compile error

#### Scenario: the diagnostic contract has one definition

- **GIVEN** `src/typecheck/types.ts` and `src/curriculum/types.ts`
- **WHEN** the curriculum module's imports are inspected
- **THEN** `ExpectedDiagnostic` is imported from the typecheck module, so a
  change to the contract cannot leave the two sides disagreeing

#### Scenario: lesson code cannot carry markup

- **GIVEN** a lesson's `js` and `ts` panes
- **WHEN** they are rendered by any page
- **THEN** their `code` is a plain string placed in a text node, never assigned
  as HTML, because the model offers no HTML-bearing field to render
