## 1. OpenSpec and persistence module

- [x] 1.1 Scaffold `openspec/changes/persist-ai-chat-history` with proposal, design, tasks, delta specs
- [x] 1.2 Add `src/lib/ai-chat-history.ts` — parse, serialize, trim, read/write/clear
- [x] 1.3 Unit tests `tests/unit/ai-chat-history.spec.ts`

## 2. Sidebar and store

- [x] 2.1 Hydrate messages on client mount; persist after completed `send()` turns
- [x] 2.2 Add `ts-ai-clear-chat` header button; stop wiping messages on `loadModel` success
- [x] 2.3 `aiChat` store: `clearChatHistory()` + `historyRevision`; sidebar watch
- [x] 2.4 Unit tests `tests/unit/ts-ai-chat-history.spec.ts`

## 3. Profile and hygiene

- [x] 3.1 `data-hygiene.ts` — inventory, `SCHOOL_STORAGE_KEYS`, export `chatHistory`, clear-all
- [x] 3.2 `profile.vue` — Clear chat history button and copy updates
- [x] 3.3 `vd3-theme-storage.ts` protected keys
- [x] 3.4 Unit tests `data-hygiene.spec.ts`, `ai-chat-store.spec.ts`

## 4. Privacy

- [x] 4.1 Update `disclaimer.ts` privacy body; bump `TOC_VERSION` to `"5"`

## 5. E2E

- [x] 5.1 `tests/e2e/ai-chat-history.spec.ts` — seed/reload/clear sidebar
- [x] 5.2 Extend `profile-notes.spec.ts` — Profile clear chat + clear-all

## 6. Verification and commit

- [x] 6.1 Run targeted vitest and Playwright
- [x] 6.2 Commit on `dev-v0.2.0`
