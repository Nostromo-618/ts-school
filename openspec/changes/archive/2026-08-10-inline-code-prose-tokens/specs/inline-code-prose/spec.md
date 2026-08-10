## Purpose

Curriculum and glossary prose render author-marked TypeScript/JavaScript symbols as monospace inline code with a light pill background (MDN / Handbook style), via Labs markdown backticks only — no raw HTML in lesson data and no auto-lexer.

## ADDED Requirements

### Requirement: Backticks in curriculum prose become styled inline code

Authored lesson and glossary prose strings that contain markdown inline code spans (backticks) MUST render as HTML `<code>` elements inside a prose container. The visual treatment SHALL use monospace type and a subtle pill background built from existing vd design tokens. Curriculum data MUST remain plain strings (backticks only); authors MUST NOT embed raw HTML for this purpose.

#### Scenario: Backticked token renders as code

- **GIVEN** a lesson prose field containing `` `noEmit` ``
- **WHEN** the learner views that field on the lesson page
- **THEN** the token appears as monospace inline code with a light pill background, not as literal backtick characters

#### Scenario: Plain text without backticks stays plain

- **GIVEN** prose that names an English word without backticks
- **WHEN** the page renders
- **THEN** that word is not wrapped in `<code>`

### Requirement: Prose HTML pipeline is XSS-safe

Curriculum prose rendered as HTML MUST escape adversarial markup (script tags, event-handler attributes, raw angle brackets) through the same Labs markdown escape path used elsewhere on the site. Dangerous URL schemes in markdown links MUST NOT become navigable script vectors.

#### Scenario: Script tags are escaped

- **GIVEN** prose containing `<script>alert(1)</script>` and a backticked token
- **WHEN** the prose is rendered to HTML
- **THEN** no live `<script>` element is produced and angle brackets appear escaped

### Requirement: Prose surfaces share one rendering path

Lesson summary, problem, insights, security body, dual-pane captions, quiz prompts/choices/explanations, exercise prompts/hints, glossary definitions, and curriculum map lesson summaries MUST use the shared prose rendering path when they display authored strings that may contain backticks.

#### Scenario: Glossary definition with backticks

- **GIVEN** a glossary definition containing a backticked symbol
- **WHEN** the glossary page renders that term
- **THEN** the symbol appears as styled inline code

### Requirement: Editorial convention without auto-lexing

Authors SHALL mark TS/JS symbols with backticks and leave English homographs unmarked. The system MUST NOT invent an automatic lexer that wraps bare tokens.

#### Scenario: No automatic wrapping of bare identifiers

- **GIVEN** prose containing the bare word `string` without backticks
- **WHEN** the prose renderer runs
- **THEN** the word is not automatically wrapped in `<code>`
