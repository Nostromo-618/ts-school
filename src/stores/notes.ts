/**
 * Learner notes — localStorage only, schema-validated on read.
 *
 * Corrupt or wrong-version payloads are discarded. SSR never touches
 * localStorage; call `hydrate()` from a client `onMounted`.
 */

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  NOTES_FOLDED_KEY,
  NOTES_PINNED_KEY,
  NOTES_PIN_SIDE_KEY,
  NOTES_WINDOW_STORAGE_KEY,
  clampNotesWindow,
  defaultNotesWindow,
  parseFoldedFlag,
  parseNotesWindow,
  readLegacyPinSide,
  serializeFoldedFlag,
  type NotesWindowV1,
} from "@/lib/notes-window";

export const NOTES_STORAGE_KEY = "ts-school-notes";
export {
  NOTES_FOLDED_KEY,
  NOTES_PINNED_KEY,
  NOTES_PIN_SIDE_KEY,
  NOTES_WINDOW_STORAGE_KEY,
} from "@/lib/notes-window";
export const NOTES_SCHEMA_VERSION = 1 as const;

/** Soft warning threshold — long notes stay localStorage until quota forces IDB. */
export const NOTES_SOFT_SIZE_BYTES = 100_000;

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

function currentViewport(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: 1280, height: 800 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

function writeWindow(win: NotesWindowV1): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTES_WINDOW_STORAGE_KEY, JSON.stringify(win));
  } catch {
    /* private mode / quota */
  }
}

function writeFolded(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTES_FOLDED_KEY, serializeFoldedFlag(value));
  } catch {
    /* private mode / quota */
  }
}

function deleteLegacyPinKeys(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(NOTES_PINNED_KEY);
    window.localStorage.removeItem(NOTES_PIN_SIDE_KEY);
  } catch {
    /* ignore */
  }
}

export const useNotesStore = defineStore("notes", () => {
  const body = ref("");
  const updatedAt = ref(new Date(0).toISOString());
  const open = ref(false);
  const folded = ref(false);
  const geometry = ref<NotesWindowV1>(defaultNotesWindow(currentViewport()));
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

    const viewport = currentViewport();
    let loaded: NotesWindowV1 | undefined;
    try {
      const rawWin = window.localStorage.getItem(NOTES_WINDOW_STORAGE_KEY);
      if (rawWin !== null) {
        try {
          loaded = parseNotesWindow(JSON.parse(rawWin) as unknown);
          if (!loaded) {
            window.localStorage.removeItem(NOTES_WINDOW_STORAGE_KEY);
          }
        } catch {
          window.localStorage.removeItem(NOTES_WINDOW_STORAGE_KEY);
        }
      }
    } catch {
      /* ignore */
    }

    const legacySide = readLegacyPinSide((key) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    });

    if (loaded) {
      const clamped = clampNotesWindow(loaded, viewport);
      geometry.value = clamped;
      if (
        clamped.x !== loaded.x ||
        clamped.y !== loaded.y ||
        clamped.width !== loaded.width ||
        clamped.height !== loaded.height
      ) {
        writeWindow(clamped);
      }
    } else if (legacySide !== undefined) {
      geometry.value = defaultNotesWindow(viewport, legacySide);
      writeWindow(geometry.value);
    } else {
      geometry.value = defaultNotesWindow(viewport);
    }

    try {
      const rawFold = window.localStorage.getItem(NOTES_FOLDED_KEY);
      folded.value = parseFoldedFlag(rawFold);
    } catch {
      folded.value = false;
    }

    deleteLegacyPinKeys();
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
    reclampToViewport();
  }

  function closeNotes(): void {
    open.value = false;
  }

  function setFolded(value: boolean): void {
    folded.value = value;
    writeFolded(value);
  }

  function toggleFold(): void {
    setFolded(!folded.value);
  }

  function setWindow(next: NotesWindowV1): void {
    const clamped = clampNotesWindow(next, currentViewport());
    geometry.value = clamped;
    writeWindow(clamped);
  }

  function reclampToViewport(): void {
    geometry.value = clampNotesWindow(geometry.value, currentViewport());
    writeWindow(geometry.value);
  }

  /** Reset chrome prefs after Profile clear-all (body cleared separately). */
  function resetChromePrefs(): void {
    folded.value = false;
    geometry.value = defaultNotesWindow(currentViewport());
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(NOTES_WINDOW_STORAGE_KEY);
        window.localStorage.removeItem(NOTES_FOLDED_KEY);
        deleteLegacyPinKeys();
      } catch {
        /* ignore */
      }
    }
  }

  return {
    body,
    updatedAt,
    open,
    folded,
    geometry,
    ready,
    approxBytes,
    nearSoftLimit,
    hydrate,
    setBody,
    clearNotes,
    openNotes,
    closeNotes,
    setFolded,
    toggleFold,
    setWindow,
    reclampToViewport,
    resetChromePrefs,
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
      folded.value = false;
      geometry.value = defaultNotesWindow({ width: 1280, height: 800 });
      ready.value = false;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(NOTES_STORAGE_KEY);
          window.localStorage.removeItem(NOTES_WINDOW_STORAGE_KEY);
          window.localStorage.removeItem(NOTES_FOLDED_KEY);
          window.localStorage.removeItem(NOTES_PINNED_KEY);
          window.localStorage.removeItem(NOTES_PIN_SIDE_KEY);
        } catch {
          /* ignore */
        }
      }
    },
  };
});
