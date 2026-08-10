# ai-risk-disclaimer Specification

## Purpose
Versioned mandatory AI risk disclosure that blocks the lesson AI assistant until the learner accepts, separate from the site-wide terms gate.
## Requirements
### Requirement: AI risk acceptance is versioned and persisted

The site MUST store AI risk acceptance in `localStorage` as versioned JSON (`version`, `acceptedAt`). When the AI risk copy version bumps, returning visitors MUST be prompted again before using chat.

#### Scenario: First open without acceptance
- **WHEN** the learner opens Ask / AI chat and no matching AI risk acceptance exists
- **THEN** a mandatory AI risk modal is shown and the chat composer / model load controls remain unusable until Accept

#### Scenario: Version mismatch forces re-consent
- **WHEN** stored AI risk acceptance version does not match the current version
- **THEN** the modal is shown again and prior acceptance MUST NOT unlock chat

#### Scenario: Matching acceptance unlocks chat
- **WHEN** stored acceptance version matches the current AI risk version
- **THEN** opening Ask opens the sidebar without showing the AI risk modal

### Requirement: Decline closes chat without acceptance

Declining or dismissing via Escape MUST close the AI sidebar and MUST NOT write acceptance.

#### Scenario: Decline
- **WHEN** the learner chooses Decline on the AI risk modal
- **THEN** the sidebar closes and no AI risk acceptance is stored

#### Scenario: Escape declines
- **WHEN** the AI risk modal is open and the learner presses Escape
- **THEN** the behavior matches Decline

### Requirement: AI risk copy covers assistant-specific risks

The AI risk modal MUST disclose local model resource use, hallucination risk, no professional/security guarantee, human Accept for tool-backed editor edits, EU AI Act transparency for the assistant, and that data stays in-browser except opt-in Hugging Face fetches.

#### Scenario: Required themes present
- **WHEN** the AI risk modal is displayed
- **THEN** its sections cover the themes above

### Requirement: Clear all removes AI risk acceptance

When the learner confirms Clear all on Profile, the system MUST remove stored AI risk acceptance so the next Ask open requires the versioned AI risk modal again. Decline/Escape behavior of the modal itself is unchanged.

#### Scenario: Ask after clear all requires re-consent

- **GIVEN** AI risk acceptance was previously stored
- **WHEN** Clear all is confirmed and the learner opens Ask
- **THEN** the AI risk modal is shown before chat is usable

