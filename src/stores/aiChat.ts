/**
 * Lesson AI chat shell state — open/pinned, with pin preference in localStorage.
 *
 * SSR never touches storage; call `hydrate()` from a client `onMounted` (same
 * pattern as progress / disclaimer consent).
 *
 * Pin preference is three-state in storage:
 * - missing key → never set; first successful `openChat` auto-pins and writes `"1"`
 * - `"0"` → explicitly unpinned; later opens stay unpinned
 * - `"1"` → pinned; hydrate reopens the pane
 */

import { clearAiChatHistory } from "@/lib/ai-chat-history";
import { defineStore } from "pinia";
import { ref } from "vue";

export const AI_CHAT_PINNED_KEY = "ts-school-ai-chat-pinned";

/** `null` = never set; `true`/`false` = explicit preference. */
export type AiChatPinPreference = boolean | null;

function readPinPreference(): AiChatPinPreference {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AI_CHAT_PINNED_KEY);
    if (raw === null) return null;
    if (raw === "1" || raw === "true") return true;
    if (raw === "0" || raw === "false") return false;
    return null;
  } catch {
    return null;
  }
}

function writePinned(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AI_CHAT_PINNED_KEY, value ? "1" : "0");
  } catch {
    /* private mode / quota — preference stays in-memory for the session */
  }
}

export type PendingComposerPrompt = {
  text: string;
  /** Sidebar auto-sends only when the model is already Ready. */
  autoSend: boolean;
};

export const useAiChatStore = defineStore("aiChat", () => {
  const open = ref(false);
  const pinned = ref(false);
  const ready = ref(false);
  /** One-shot composer seed consumed by TsAiChatSidebar when the pane is open. */
  const pendingComposerText = ref<string | null>(null);
  const pendingAutoSend = ref(false);
  /** Bumped when Profile or other callers clear persisted chat history. */
  const historyRevision = ref(0);

  const hydrate = (): void => {
    if (ready.value) return;
    const preference = readPinPreference();
    pinned.value = preference === true;
    if (pinned.value) open.value = true;
    ready.value = true;
  };

  /**
   * Open the pane. On first open with no stored pin preference, auto-pin and
   * persist `"1"`. Explicit `"0"` is respected and not overridden.
   */
  const openChat = (): void => {
    open.value = true;
    if (readPinPreference() === null) {
      setPinned(true);
    }
  };

  /** Close the pane. Closing while pinned also clears the pin preference. */
  const closeChat = (): void => {
    open.value = false;
    if (pinned.value) {
      pinned.value = false;
      writePinned(false);
    }
  };

  const setPinned = (value: boolean): void => {
    pinned.value = value;
    if (value) open.value = true;
    writePinned(value);
  };

  const togglePin = (): void => {
    setPinned(!pinned.value);
  };

  /**
   * Queue text for the Ask composer. Prefer opening the chat after queueing so
   * a remounted sidebar can pick it up immediately.
   */
  const queueComposerPrompt = (
    text: string,
    options?: { autoSend?: boolean },
  ): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    pendingComposerText.value = trimmed;
    pendingAutoSend.value = options?.autoSend === true;
  };

  /** Take and clear any pending composer seed (sidebar only). */
  const takePendingComposer = (): PendingComposerPrompt | null => {
    const text = pendingComposerText.value;
    if (!text) return null;
    const autoSend = pendingAutoSend.value;
    pendingComposerText.value = null;
    pendingAutoSend.value = false;
    return { text, autoSend };
  };

  const clearChatHistory = (): void => {
    clearAiChatHistory();
    historyRevision.value += 1;
  };

  return {
    open,
    pinned,
    ready,
    pendingComposerText,
    pendingAutoSend,
    historyRevision,
    hydrate,
    openChat,
    closeChat,
    setPinned,
    togglePin,
    queueComposerPrompt,
    takePendingComposer,
    clearChatHistory,
  };
});
