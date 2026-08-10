## ADDED Requirements

### Requirement: Progress store remains the single source for Profile and AI

Learner progress MUST continue to persist only under `ts-school-progress` with schema validation as already specified. Profile summaries, export payloads, clear-all, and AI progress context MUST read and mutate that same store — the system MUST NOT introduce a second progress schema or duplicate lesson-completion flags.

#### Scenario: Profile completion matches curriculum meters

- **GIVEN** a learner with completed lessons recorded in the progress store
- **WHEN** Profile and the curriculum map both render
- **THEN** completion counts for a track agree between Profile and the curriculum `VdProgress` meters

#### Scenario: Clear all empties the progress store

- **GIVEN** lessons marked complete in the progress store
- **WHEN** Clear all is confirmed on Profile
- **THEN** the progress store hydrates as empty and curriculum meters show zero
