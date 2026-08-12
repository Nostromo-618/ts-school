## MODIFIED Requirements

### Requirement: Profile inventories local browser data

Profile MUST list the school-relevant local data present in the browser, including at least: progress (`ts-school-progress`), notes (`ts-school-notes`), ToC acceptance, legacy AI risk acceptance key when present, AI chat pin preference, Ask chat history (`ts-school-ai-chat-history` when present), notes window geometry preference (`ts-school-notes-window` when present), notes fold preference (`ts-school-notes-folded` when present), and vd3 theme preference keys when present. Legacy notes pin keys (`ts-school-notes-pinned`, `ts-school-notes-pin-side`) MAY appear in inventory only while still present during migration, and MUST NOT be required once cleared. The inventory MUST state that data is local-only and that some model caches may not be fully enumerable or deletable from page JavaScript.

#### Scenario: Chat history key appears when set

- **GIVEN** localStorage contains `ts-school-ai-chat-history`
- **WHEN** Profile's data inventory renders
- **THEN** that key is listed as present

### Requirement: Export all local school data

Profile MUST offer an Export action that downloads a JSON document containing at least: schema/export version, exportedAt timestamp, progress payload (if any), notes payload (if any), chat history payload (if any), and preference snapshots for school keys the product owns (ToC, legacy AI risk key if present, AI pin, model id when present, notes window geometry, notes fold). Theme preference keys MAY be included when readable. Export MUST NOT require a network call. Legacy notes pin preference keys MAY be included only if still present.

#### Scenario: Export includes chat history when set

- **GIVEN** valid chat history in localStorage
- **WHEN** Export runs
- **THEN** the JSON includes a `chatHistory` field with the stored messages

## ADDED Requirements

### Requirement: Clear chat history from Profile

Profile MUST offer a Clear chat history action that removes `ts-school-ai-chat-history` and resets any open Ask sidebar transcript, without clearing progress, notes, or consent keys.

#### Scenario: Clear chat history only

- **GIVEN** chat history, notes, and progress all stored
- **WHEN** the learner clears chat history from Profile
- **THEN** chat history storage is empty and progress and notes remain intact

### Requirement: Clear all data with confirmation

Profile MUST offer Clear all with a confirmation step that removes progress, notes, notes window preferences, AI pin preference, Ask chat history, theme preferences this site can write, Terms acceptance, and any legacy AI risk key, and MUST run best-effort deletion of on-device model caches (Cache Storage / IndexedDB names that look like model artifacts, and Labs model-cached flags). Clear all MUST reset in-memory stores and consent state so the learner must accept Terms again before using gated content. Clear all MUST NOT require a network call.

#### Scenario: Clear all removes chat history

- **GIVEN** seeded chat history
- **WHEN** Clear all is confirmed
- **THEN** `ts-school-ai-chat-history` is absent after reload
