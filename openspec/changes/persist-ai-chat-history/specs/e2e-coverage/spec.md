## ADDED Requirements

### Requirement: Ask chat history persists across reload

Playwright Chromium Desktop MUST cover Ask chat history without loading real model weights: seed `ts-school-ai-chat-history`, reload, assert user bubble text is visible; activate sidebar clear chat and assert the storage key is absent and the pane is empty; seed again and confirm Profile clear chat history removes the key.

#### Scenario: Seeded history survives reload

- **GIVEN** ToC acceptance seeded and valid chat history in localStorage
- **WHEN** the learner opens Ask after reload
- **THEN** a prior user message bubble is visible

#### Scenario: Sidebar clear removes history

- **GIVEN** seeded chat history and Ask open
- **WHEN** the learner clicks clear chat in the sidebar
- **THEN** the message pane is empty and `ts-school-ai-chat-history` is absent

#### Scenario: Profile clear chat removes history

- **GIVEN** seeded chat history
- **WHEN** the learner clears chat history from Profile
- **THEN** `ts-school-ai-chat-history` is absent
