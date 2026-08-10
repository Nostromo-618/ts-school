## ADDED Requirements

### Requirement: Lesson solution section smoke

An authored lesson page MUST expose a Solution heading so learners can find the
narrative that explains the TypeScript fix after the dual panes.

#### Scenario: Solution heading appears on a lesson page

- **GIVEN** an authored lesson with a non-empty `solution` field
- **WHEN** the learner opens that lesson on Chromium Desktop
- **THEN** the page MUST show a heading whose accessible name matches
  `/solution/i` (for example "The solution")
