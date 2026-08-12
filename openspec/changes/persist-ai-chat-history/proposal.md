## Why

Ask chat transcripts today live only in an in-memory Vue ref. Closing the tab or reloading wipes the conversation even though learners expect scratchpad-style continuity (like notes). Profile export/clear and the ToC privacy copy also treat chat as ephemeral tab memory, which no longer matches product intent.

## What Changes

- **Persist** a single global Ask transcript in `localStorage` under `ts-school-ai-chat-history` (schema v1).
- **Hydrate** the sidebar on mount; **write** after each completed send turn.
- **Clear chat** from the Ask sidebar header (quick action) and from Profile (beside Clear notes).
- **Include** chat history in Profile inventory, export JSON, and Clear all.
- **Update** ToC privacy copy and bump `TOC_VERSION` to reflect local chat history storage.
- **Keep** transcript on model Load/Reload (stop wiping bubbles on successful load).
- **Unit + Playwright** coverage for parse/hydrate/clear/reload without loading real model weights.

## Non-goals

- Server sync, accounts, or cloud backup.
- Per-lesson or per-route separate transcripts (global thread only).
- Replaying restored turns into Labs `AiChat` inference context in v1 (display persistence only after reload).
- Exporting chat to a separate markdown file.
- Changing default model selection or Ask pin/dock behavior.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `lesson-ai-assistant`: Persist/hydrate global transcript, trim/corrupt handling, sidebar clear chat, keep bubbles on model reload.
- `learner-profile`: Inventory, export `chatHistory`, Clear chat history action, Clear all includes chat key.
- `e2e-coverage`: Reload restores seeded history; sidebar and Profile clear wipe key.
- `ai-risk-disclaimer`: Privacy copy states chat history is stored locally in the browser.

## Impact

- `src/lib/ai-chat-history.ts` (new), `src/overlays/TsAiChatSidebar.vue`, `src/stores/aiChat.ts`, `src/lib/data-hygiene.ts`, `src/pages/profile.vue`, `src/content/disclaimer.ts`, `src/lib/vd3-theme-storage.ts`.
- Tests: `tests/unit/ai-chat-history.spec.ts`, `tests/unit/ts-ai-chat-history.spec.ts`, updates to `data-hygiene`, `ai-chat-store`, `profile-notes` e2e, new `ai-chat-history` e2e.
- **Routes/lessons:** None added, changed, or removed.
