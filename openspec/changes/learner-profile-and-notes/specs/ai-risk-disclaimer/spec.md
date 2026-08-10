## ADDED Requirements

### Requirement: Clear all removes AI risk acceptance

When the learner confirms Clear all on Profile, the system MUST remove stored AI risk acceptance so the next Ask open requires the versioned AI risk modal again. Decline/Escape behavior of the modal itself is unchanged.

#### Scenario: Ask after clear all requires re-consent

- **GIVEN** AI risk acceptance was previously stored
- **WHEN** Clear all is confirmed and the learner opens Ask
- **THEN** the AI risk modal is shown before chat is usable
