## ADDED Requirements

### Requirement: solution section after dual panes

After the dual pane, the lesson page MUST render a section headed "The solution"
(or equivalent accessible heading) whose body is the lesson's `solution` prose
via ProseHtml. The section MUST appear before takeaways, security, diagram,
quiz, and exercise.

#### Scenario: solution heading and body render

- **GIVEN** an authored lesson with non-empty `solution`
- **WHEN** the learner opens that lesson
- **THEN** a Solution heading is present and the `solution` prose is visible
  beneath the dual pane and above takeaways

### Requirement: prerequisites at the bottom of the lesson

When a lesson has one or more resolvable prerequisites, the page MUST render
"Read these first" after the main teaching blocks (problem, dual panes,
solution, takeaways, optional security/diagram, quiz, exercise, references) and
before the previous/next pager. Prerequisites MUST NOT appear between problem
and dual panes.

#### Scenario: prerequisites follow exercise and precede pager

- **GIVEN** a lesson with at least one prerequisite and an exercise
- **WHEN** the page renders
- **THEN** "Read these first" appears below the exercise block and above the
  lesson pager

#### Scenario: prerequisites omitted when empty

- **GIVEN** a lesson with an empty `prerequisites` list
- **WHEN** the page renders
- **THEN** no "Read these first" region is shown

## MODIFIED Requirements

### Requirement: lesson page composition

One lesson route component MUST render every lesson in this order: breadcrumbs,
title, tier badge, track label, summary, problem, dual pane, solution narrative,
insight bullets when present, an optional security note when present, an
optional flowchart when diagram data is present, optional quiz and exercise
blocks when authored, optional references, prerequisites ("Read these first")
when present, a mark-complete control (placement unchanged relative to exercise
vs standalone), and previous/next navigation. Missing optional fields MUST be
omitted without error.

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
- **THEN** both blocks are shown beneath the solution section

#### Scenario: teaching order puts solution before takeaways

- **GIVEN** a lesson with `solution` and non-empty `insight`
- **WHEN** the page renders
- **THEN** the Solution section appears after the dual pane and before the
  Takeaways section
