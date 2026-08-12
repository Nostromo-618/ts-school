## Context

Ask UI (`TsAiChatSidebar.vue`) holds `messages` in a component ref. Pin preference and model id persist via `aiChat` store and `school-model-picker`; transcript does not. Profile hygiene (`data-hygiene.ts`) mirrors notes/progress patterns for export and clear-all. ToC section “Privacy & local storage” currently says chat stays in tab memory only.

Constraints: static vite-ssg, strict CSP, localStorage-only, no server, Labs `AiChat` internal history is session-scoped on the engine.

## Goals / Non-Goals

**Goals:**

- Global single-thread transcript survives page reload.
- Quick clear in sidebar + dedicated Profile action + Clear all inclusion.
- Schema-validated read; corrupt/wrong-version discard; size cap before write.
- Export includes `chatHistory` field parallel to `notes`.
- ToC privacy copy + version bump.

**Non-goals:**

- Per-lesson threads.
- Injecting restored bubbles into Labs inference after reload (v1 is display-only for engine context).
- Debounced writes (persist on completed turn is sufficient).

## Decisions

### D1 — Storage key and schema

- **Choice:** `ts-school-ai-chat-history` — JSON `{ version: 1, messages: AskChatMessage[], updatedAt: ISO }`.
- **Why:** Matches school key naming; versioned payload like notes/progress.
- **Alternatives:** Pinia persist plugin (rejected — inconsistent with notes pattern).

### D2 — Global scope

- **Choice:** One transcript for the whole site; navigation does not switch threads.
- **Why:** User confirmed; sidebar is global.

### D3 — Size cap

- **Choice:** Trim oldest messages when count > 100 or serialized size > ~200 KB.
- **Why:** Prevent localStorage quota failures on long sessions.

### D4 — Model reload

- **Choice:** Remove `messages.value = []` on successful `loadModel`; keep Labs `resetMessages: true` for engine state.
- **Why:** Learners expect history to survive reload of weights.

### D5 — Inference after page reload

- **Choice:** Restored bubbles are for learner reference; Labs engine starts fresh until new sends. Document limitation; optional upstream replay if `vdl-ai-chat` adds API.
- **Why:** No public history-restore API in Labs today.

### D6 — Clear surfaces

- **Choice:** Immediate clear (no confirm modal) in sidebar; Profile button mirrors Clear notes (immediate, status message).
- **Why:** User asked for quick clear in pane; Profile pattern already established for notes.

### D7 — Store coupling

- **Choice:** `aiChat` store exposes `historyRevision` counter bumped by `clearChatHistory()`; sidebar watches and resets in-memory messages.
- **Why:** Profile clear while sidebar mounted stays in sync.

### D8 — Privacy

- **Choice:** Update disclaimer body; bump `TOC_VERSION` to `"5"`.
- **Why:** Meaningful privacy copy change per `ai-risk-disclaimer` spec.

## Risks

- **Quota:** Trim + try/catch on write; silent fail acceptable for session (same as pin pref).
- **Stale engine context:** User may think model remembers pre-reload turns — mitigated by design note; future: replay or system-prompt summary.

## Migration

No migration needed — empty state when key absent.
