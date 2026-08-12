## ADDED Requirements

### Requirement: Global Ask chat history persists locally

The Ask sidebar MUST persist a single global transcript in `localStorage` under `ts-school-ai-chat-history` using schema version 1 (`messages` array of user/assistant turns with optional policy `kind`). The sidebar MUST hydrate from storage on client mount. The product MUST write storage after each completed send turn (not during in-flight streaming). Corrupt or wrong-version payloads MUST be discarded without breaking the sidebar. Before write, the product MUST trim oldest messages when count exceeds ~100 or serialized size exceeds ~200 KB.

#### Scenario: Reload restores transcript

- **GIVEN** valid chat history in localStorage
- **WHEN** the learner reloads the page and opens Ask
- **THEN** prior user and assistant bubbles are visible without loading the model

#### Scenario: Corrupt history is ignored

- **GIVEN** invalid JSON or wrong schema version in `ts-school-ai-chat-history`
- **WHEN** the sidebar mounts
- **THEN** the transcript starts empty and the sidebar remains usable

### Requirement: Clear chat from Ask sidebar

The Ask sidebar header MUST expose a clear-chat control (`data-testid="ts-ai-clear-chat"`) that removes persisted history and clears in-memory bubbles immediately. The control MUST be disabled while a send is streaming.

#### Scenario: Sidebar clear wipes storage

- **GIVEN** persisted chat history
- **WHEN** the learner activates clear chat in the sidebar
- **THEN** `ts-school-ai-chat-history` is absent and the message pane is empty

### Requirement: Model reload keeps visible transcript

When the learner loads or reloads the Gemma model, the visible transcript MUST NOT be cleared. Labs engine message reset MAY still occur internally.

#### Scenario: Load model preserves bubbles

- **GIVEN** messages visible in the sidebar
- **WHEN** the learner clicks Load or Reload model successfully
- **THEN** the same bubbles remain visible
