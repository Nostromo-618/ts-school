## ADDED Requirements

### Requirement: Inline code prose smoke

Chromium Desktop e2e MUST open a known lesson whose authored prose contains
markdown backticks and assert that at least one `<code>` element is visible in
the lesson prose (not literal backtick characters alone).

#### Scenario: Backticked lesson shows code element

- **GIVEN** a lesson with backticked tokens in insight or caption prose
- **WHEN** the learner opens that lesson on Chromium Desktop
- **THEN** a `<code>` element containing the token is visible in the page

### Requirement: Quiz choices expose letter prefixes

Chromium Desktop e2e (or a focused unit mount of the quiz block) MUST assert
that quiz answer choices are labeled with sequential letters A, B, C, D in
order.

#### Scenario: First-type-error quiz shows A–D

- **GIVEN** the first-type-error fixture lesson with a multi-choice quiz
- **WHEN** the quiz block is shown
- **THEN** choice controls expose the prefixes A, B, C, and D
