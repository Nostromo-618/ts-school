import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import {
  AI_CHAT_PINNED_KEY,
  useAiChatStore,
} from "@/stores/aiChat";

describe("aiChat store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("hydrates a pinned preference and defers open until risk consent", () => {
    localStorage.setItem(AI_CHAT_PINNED_KEY, "1");
    const store = useAiChatStore();

    expect(store.ready).toBe(false);
    expect(store.open).toBe(false);

    store.hydrate();

    expect(store.ready).toBe(true);
    expect(store.pinned).toBe(true);
    expect(store.open).toBe(false);
    expect(store.pendingOpenAfterRisk).toBe(true);

    store.openChat();
    expect(store.open).toBe(true);
    expect(store.pendingOpenAfterRisk).toBe(false);

    store.hydrate();
    expect(store.pinned).toBe(true);
  });

  it("persists pin toggles and keeps the pane open while pinning", () => {
    const store = useAiChatStore();
    store.hydrate();

    store.openChat();
    store.togglePin();

    expect(store.pinned).toBe(true);
    expect(store.open).toBe(true);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("1");

    store.togglePin();
    expect(store.pinned).toBe(false);
    expect(store.open).toBe(true);
    expect(localStorage.getItem(AI_CHAT_PINNED_KEY)).toBe("0");
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
});
