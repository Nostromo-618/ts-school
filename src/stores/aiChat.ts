/**
 * Lesson AI chat shell state — open/pinned, with pin preference in localStorage.
 *
 * SSR never touches storage; call `hydrate()` from a client `onMounted` (same
 * pattern as progress / disclaimer consent).
 *
 * Pin preference is three-state in storage:
 * - missing key → never set; first successful `openChat` auto-pins and writes `"1"`
 * - `"0"` → explicitly unpinned; later opens stay unpinned
 * - `"1"` → pinned; hydrate may reopen after AI risk consent
 */

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

export const useAiChatStore = defineStore("aiChat", () => {
  const open = ref(false);
  const pinned = ref(false);
  const ready = ref(false);
  /** True when hydrate wanted the pane open but AI risk consent is still pending. */
  const pendingOpenAfterRisk = ref(false);

  const hydrate = (): void => {
    if (ready.value) return;
    const preference = readPinPreference();
    pinned.value = preference === true;
    // Do not auto-open until AI risk consent is confirmed by App.
    if (pinned.value) pendingOpenAfterRisk.value = true;
    ready.value = true;
  };

  /**
   * Open the pane. On first open with no stored pin preference, auto-pin and
   * persist `"1"`. Explicit `"0"` is respected and not overridden.
   * Call after AI risk accept (or when consent already granted).
   */
  const openChat = (): void => {
    open.value = true;
    pendingOpenAfterRisk.value = false;
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

  return {
    open,
    pinned,
    ready,
    pendingOpenAfterRisk,
    hydrate,
    openChat,
    closeChat,
    setPinned,
    togglePin,
  };
});
