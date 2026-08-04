## MODIFIED Requirements

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
