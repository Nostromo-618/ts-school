import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { AI_CHAT_HISTORY_KEY, writeAiChatHistory } from "@/lib/ai-chat-history";
import {
  AI_CHAT_PINNED_KEY,
  useAiChatStore,
} from "@/stores/aiChat";

describe("aiChat store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("hydrates a pinned preference and reopens the pane", () => {
    localStorage.setItem(AI_CHAT_PINNED_KEY, "1");
    const store = useAiChatStore();

    expect(store.ready).toBe(false);
    expect(store.open).toBe(false);

    store.hydrate();

    expect(store.ready).toBe(true);
    expect(store.pinned).toBe(true);
    expect(store.open).toBe(true);

    store.hydrate();
    expect(store.pinned).toBe(true);
  });

  it("auto-pins on first open when preference is unset", () => {
    const store = useAiChatStore();
    store.hydrate();

    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBeNull();
    expect(store.pinned).toBe(false);

    store.openChat();

    expect(store.open).toBe(true);
    expect(store.pinned).toBe(true);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("1");
  });

  it("does not force-pin when user explicitly unpinned", () => {
    localStorage.setItem(AI_CHAT_PINNED_KEY, "0");
    const store = useAiChatStore();
    store.hydrate();

    expect(store.pinned).toBe(false);
    expect(store.open).toBe(false);

    store.openChat();

    expect(store.open).toBe(true);
    expect(store.pinned).toBe(false);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("0");
  });

  it("persists pin toggles and keeps the pane open while pinning", () => {
    const store = useAiChatStore();
    store.hydrate();

    store.openChat();
    expect(store.pinned).toBe(true);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("1");

    store.togglePin();
    expect(store.pinned).toBe(false);
    expect(store.open).toBe(true);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("0");

    store.togglePin();
    expect(store.pinned).toBe(true);
    expect(store.open).toBe(true);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("1");
  });

  it("clears pin when the pane is closed while pinned", () => {
    const store = useAiChatStore();
    store.hydrate();
    store.setPinned(true);

    store.closeChat();

    expect(store.open).toBe(false);
    expect(store.pinned).toBe(false);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("0");
  });

  it("stays unpinned on later opens after close-while-pinned wrote 0", () => {
    const store = useAiChatStore();
    store.hydrate();
    store.openChat();
    expect(store.pinned).toBe(true);

    store.closeChat();
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("0");

    store.openChat();
    expect(store.open).toBe(true);
    expect(store.pinned).toBe(false);
  });

  it("queues and consumes a one-shot composer prompt", () => {
    const store = useAiChatStore();
    store.queueComposerPrompt("Help with exercise", { autoSend: true });

    expect(store.pendingComposerText).toBe("Help with exercise");
    expect(store.pendingAutoSend).toBe(true);

    const taken = store.takePendingComposer();
    expect(taken).toEqual({ text: "Help with exercise", autoSend: true });
    expect(store.pendingComposerText).toBeNull();
    expect(store.pendingAutoSend).toBe(false);
    expect(store.takePendingComposer()).toBeNull();
  });

  it("ignores blank composer prompts", () => {
    const store = useAiChatStore();
    store.queueComposerPrompt("   ");
    expect(store.pendingComposerText).toBeNull();
  });

  it("clearChatHistory removes storage and bumps historyRevision", () => {
    writeAiChatHistory([{ role: "user", content: "persisted" }]);
    const store = useAiChatStore();
    const before = store.historyRevision;

    store.clearChatHistory();

    expect(localStorage.getItem(AI_CHAT_HISTORY_KEY)).toBeNull();
    expect(store.historyRevision).toBe(before + 1);
  });
});
