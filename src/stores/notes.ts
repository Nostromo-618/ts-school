/**
 * Learner notes — localStorage only, schema-validated on read.
 *
 * Corrupt or wrong-version payloads are discarded. SSR never touches
 * localStorage; call `hydrate()` from a client `onMounted`.
 */

import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const NOTES_STORAGE_KEY = "ts-school-notes";
export const NOTES_PINNED_KEY = "ts-school-notes-pinned";
export const NOTES_PIN_SIDE_KEY = "ts-school-notes-pin-side";
export const NOTES_SCHEMA_VERSION = 1 as const;

/** Soft warning threshold — long notes stay localStorage until quota forces IDB. */
export const NOTES_SOFT_SIZE_BYTES = 100_000;

export type NotesPinSide = "left" | "right";

export interface NotesV1 {
  version: typeof NOTES_SCHEMA_VERSION;
  body: string;
  updatedAt: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseNotes(raw: unknown): NotesV1 | undefined {
  if (!isPlainObject(raw)) return undefined;
  if (raw.version !== NOTES_SCHEMA_VERSION) return undefined;
  if (typeof raw.body !== "string") return undefined;
  if (typeof raw.updatedAt !== "string") return undefined;
  return {
    version: NOTES_SCHEMA_VERSION,
    body: raw.body,
    updatedAt: raw.updatedAt,
  };
}

function emptyNotes(): NotesV1 {
  return {
    version: NOTES_SCHEMA_VERSION,
    body: "",
    updatedAt: new Date(0).toISOString(),
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function readPinned(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(NOTES_PINNED_KEY);
    return raw === "1" || raw === "true";
  } catch {
    return false;
  }
}

function writePinned(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTES_PINNED_KEY, value ? "1" : "0");
  } catch {
    /* private mode / quota */
  }
}

function readPinSide(): NotesPinSide {
  if (typeof window === "undefined") return "right";
  try {
    const raw = window.localStorage.getItem(NOTES_PIN_SIDE_KEY);
    return raw === "left" ? "left" : "right";
  } catch {
    return "right";
  }
}

function writePinSide(side: NotesPinSide): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTES_PIN_SIDE_KEY, side);
  } catch {
    /* private mode / quota */
  }
}

export const useNotesStore = defineStore("notes", () => {
  const body = ref("");
  const updatedAt = ref(new Date(0).toISOString());
  const open = ref(false);
  const pinned = ref(false);
  const pinSide = ref<NotesPinSide>("right");
  const ready = ref(false);
  let persistTimer: ReturnType<typeof setTimeout> | null = null;

  const approxBytes = computed(() => {
    try {
      return new TextEncoder().encode(body.value).length;
    } catch {
      return body.value.length;
    }
  });

  const nearSoftLimit = computed(
    () => approxBytes.value >= NOTES_SOFT_SIZE_BYTES,
  );

  function persistNow(): void {
    if (typeof window === "undefined") return;
    const payload: NotesV1 = {
      version: NOTES_SCHEMA_VERSION,
      body: body.value,
      updatedAt: updatedAt.value,
    };
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Quota / private mode — notes stay in-memory for the session.
    }
  }

  function schedulePersist(): void {
    if (typeof window === "undefined") return;
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      persistNow();
    }, 300);
  }

  function hydrate(): void {
    if (ready.value) return;
    if (typeof window === "undefined") {
      ready.value = true;
      return;
    }
    try {
      const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
      if (raw !== null) {
        const parsed = parseNotes(JSON.parse(raw) as unknown);
        if (parsed) {
          body.value = parsed.body;
          updatedAt.value = parsed.updatedAt;
        } else {
          window.localStorage.removeItem(NOTES_STORAGE_KEY);
        }
      }
    } catch {
      try {
        window.localStorage.removeItem(NOTES_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
    pinned.value = readPinned();
    pinSide.value = readPinSide();
    // Do not auto-open on hydrate — open is session UI only.
    ready.value = true;
  }

  function setBody(next: string): void {
    body.value = next;
    updatedAt.value = nowIso();
    schedulePersist();
  }

  function clearNotes(): void {
    body.value = "";
    updatedAt.value = nowIso();
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(NOTES_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }

  function openNotes(): void {
    open.value = true;
  }

  function closeNotes(): void {
    open.value = false;
    if (pinned.value) {
      pinned.value = false;
      writePinned(false);
    }
  }

  function setPinned(value: boolean): void {
    pinned.value = value;
    if (value) open.value = true;
    writePinned(value);
  }

  function togglePin(): void {
    setPinned(!pinned.value);
  }

  function setPinSide(side: NotesPinSide): void {
    pinSide.value = side;
    writePinSide(side);
  }

  return {
    body,
    updatedAt,
    open,
    pinned,
    pinSide,
    ready,
    approxBytes,
    nearSoftLimit,
    hydrate,
    setBody,
    clearNotes,
    openNotes,
    closeNotes,
    setPinned,
    togglePin,
    setPinSide,
    /** Flush pending debounce (tests / clear-all). */
    flushPersist(): void {
      if (persistTimer) {
        clearTimeout(persistTimer);
        persistTimer = null;
      }
      persistNow();
    },
    /** Test seam: replace in-memory state without touching storage. */
    _replaceForTests(next: NotesV1): void {
      body.value = next.body;
      updatedAt.value = next.updatedAt;
      ready.value = true;
    },
    /** Test seam: clear memory + storage. */
    _resetForTests(): void {
      if (persistTimer) {
        clearTimeout(persistTimer);
        persistTimer = null;
      }
      body.value = emptyNotes().body;
      updatedAt.value = emptyNotes().updatedAt;
      open.value = false;
      pinned.value = false;
      pinSide.value = "right";
      ready.value = false;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(NOTES_STORAGE_KEY);
          window.localStorage.removeItem(NOTES_PINNED_KEY);
          window.localStorage.removeItem(NOTES_PIN_SIDE_KEY);
        } catch {
          /* ignore */
        }
      }
    },
  };
});
