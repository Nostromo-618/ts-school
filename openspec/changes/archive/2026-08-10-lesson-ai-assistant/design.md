## Decisions

1. Product UI is ts-school-owned (`TsAiChatSidebar`), not Labs VdlAiChatUI.
2. Write tools require explicit Accept modal/toast.
3. JS pane stays read-only; tools mutate TS + exercise buffers only.
4. CI stubs AiChat; no multi-GB download in Playwright.

## Non-Goals

- Live tsc in browser
- Silent editor overwrites
- Server LLM
