/**
 * Lesson AI chat shell state — open/pinned, with pin preference in localStorage.
 *
 * SSR never touches storage; call `hydrate()` from a client `onMounted` (same
 * pattern as progress / disclaimer consent).
 */

import { defineStore } from "pinia";
import { ref } from "vue";

export const AI_CHAT_PINNED_KEY = "ts-school-ai-chat-pinned";

function readPinned(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(AI_CHAT_PINNED_KEY);
    return raw === "1" || raw === "true";
  } catch {
    return false;
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
    pinned.value = readPinned();
    // Do not auto-open until AI risk consent is confirmed by App.
    if (pinned.value) pendingOpenAfterRisk.value = true;
    ready.value = true;
  };

  const openChat = (): void => {
    open.value = true;
    pendingOpenAfterRisk.value = false;
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
