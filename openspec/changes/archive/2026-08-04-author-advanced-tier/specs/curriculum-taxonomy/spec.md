## MODIFIED Requirements

### Requirement: every lesson carries its placement metadata

Every lesson MUST declare `tier`, `track`, `order`, `prerequisites`, `keywords`,
`summary`, and a one-line `problem` statement before any content is written, and
MUST satisfy the `Lesson` type in full. Code panes for beginner and intermediate
lessons MAY still be placeholders while sibling authoring changes are in flight.
Every lesson whose `tier` is `"advanced"` MUST have fully authored panes that do
not contain the placeholder marker. When panes are placeholders, they SHALL be
marked as such so that pages and the compiler-truth suite can distinguish them
from authored content.

#### Scenario: a stub is still a complete lesson

- **GIVEN** a beginner or intermediate lesson whose prose has not been written
- **WHEN** the project is type-checked
- **THEN** it compiles as a `Lesson` with no cast and no optional-field
  workaround, and its route, nav entry, and search entry all exist

#### Scenario: a content author has nothing to invent

- **GIVEN** a later change authoring a tier's content
- **WHEN** its author opens a lesson file
- **THEN** the id, title, tier, track, order, prerequisites, keywords, summary,
  and problem statement are already decided, so authoring adds prose without
  changing the taxonomy

#### Scenario: advanced lessons are no longer stubs

- **GIVEN** the advanced tier after `author-advanced-tier` lands
- **WHEN** every advanced lesson is inspected
- **THEN** neither pane contains the placeholder marker
