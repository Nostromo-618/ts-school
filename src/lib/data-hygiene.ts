/**
 * Export / clear-all helpers for learner Profile.
 *
 * Clear-all is best-effort for Cache Storage and IndexedDB used by on-device
 * LiteRT / model downloads. HTTP disk cache, OPFS without enumeration, and
 * Service Worker caches outside school control may remain — Profile copy must
 * disclose that honestly.
 */

import { AI_RISK_STORAGE_KEY } from "@/content/ai-disclaimer";
import { TOC_STORAGE_KEY, TOC_VERSION } from "@/content/disclaimer";
import { SCHOOL_AI_MODEL_ID_KEY } from "@/ai/school-model-picker";
import {
  PROGRESS_SCHEMA_VERSION,
  PROGRESS_STORAGE_KEY,
  parseProgress,
  type ProgressV1,
} from "@/stores/progress";
import { AI_CHAT_PINNED_KEY } from "@/stores/aiChat";
import {
  NOTES_FOLDED_KEY,
  NOTES_PINNED_KEY,
  NOTES_PIN_SIDE_KEY,
  NOTES_SCHEMA_VERSION,
  NOTES_STORAGE_KEY,
  NOTES_WINDOW_STORAGE_KEY,
  parseNotes,
  type NotesV1,
} from "@/stores/notes";
import {
  LEGACY_VD3_THEME_KEYS,
  VD3_THEME_KEYS,
  clearVd3ThemeStorageKeys,
} from "@/lib/vd3-theme-storage";

/** Labs AiChat marks cached models with this localStorage prefix. */
export const MODEL_CACHE_FLAG_PREFIX = "vdl-ai-chat-model-cached:";

/** Labs Cache Storage bucket for LiteRT `.litertlm` weights. */
export const LITERT_MODEL_CACHE_NAME = "vdl-litert-models";

/**
 * Heuristic matching Labs `_isLikelyModelStorageName` — Cache Storage /
 * IndexedDB names that look like MLC / WebLLM / LiteRT / model artifacts.
 * Exact LiteRT DB names vary by browser and `@litert-lm/core` version; we
 * enumerate at clear time rather than hard-coding a brittle allowlist.
 */
export function isLikelyModelStorageName(name: string): boolean {
  const normalized = String(name || "").toLowerCase();
  return /(webllm|mlc|onnx|wasm|gguf|gemma|llama|qwen|model|litert|vdl-litert)/.test(
    normalized,
  );
}

/** Site-prefixed vd3 theme keys (see `vd3-theme-storage.ts`). */
export { VD3_THEME_KEYS, LEGACY_VD3_THEME_KEYS };

export const SCHOOL_STORAGE_KEYS = [
  PROGRESS_STORAGE_KEY,
  NOTES_STORAGE_KEY,
  NOTES_WINDOW_STORAGE_KEY,
  NOTES_FOLDED_KEY,
  TOC_STORAGE_KEY,
  AI_RISK_STORAGE_KEY,
  AI_CHAT_PINNED_KEY,
  SCHOOL_AI_MODEL_ID_KEY,
] as const;

/** Cleared on clear-all even after migration removed them from inventory. */
const LEGACY_NOTES_PIN_KEYS = [NOTES_PINNED_KEY, NOTES_PIN_SIDE_KEY] as const;

export const EXPORT_VERSION = 1 as const;

export interface SchoolExportV1 {
  exportVersion: typeof EXPORT_VERSION;
  exportedAt: string;
  progress: ProgressV1 | null;
  notes: NotesV1 | null;
  preferences: Record<string, string | null>;
}

export interface LocalDataInventoryItem {
  key: string;
  present: boolean;
  group: "school" | "theme" | "model-cache-flag";
  label: string;
}

export const NON_CLEARABLE_SURFACES = [
  "HTTP disk cache for previously fetched `.litertlm` model files (browser-managed)",
  "OPFS / private filesystem entries the runtime does not enumerate",
  "Service Worker caches (this site does not register one today)",
  "OS-level or browser-private storage outside page JavaScript",
] as const;

function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function readJson(key: string): unknown {
  const raw = safeGetItem(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/** Build the Profile inventory list from current localStorage. */
export function buildLocalDataInventory(): LocalDataInventoryItem[] {
  const items: LocalDataInventoryItem[] = [
    {
      key: PROGRESS_STORAGE_KEY,
      present: safeGetItem(PROGRESS_STORAGE_KEY) !== null,
      group: "school",
      label: "Lesson progress",
    },
    {
      key: NOTES_STORAGE_KEY,
      present: safeGetItem(NOTES_STORAGE_KEY) !== null,
      group: "school",
      label: "Notes body",
    },
    {
      key: NOTES_WINDOW_STORAGE_KEY,
      present: safeGetItem(NOTES_WINDOW_STORAGE_KEY) !== null,
      group: "school",
      label: "Notes window geometry",
    },
    {
      key: NOTES_FOLDED_KEY,
      present: safeGetItem(NOTES_FOLDED_KEY) !== null,
      group: "school",
      label: "Notes fold preference",
    },
    {
      key: TOC_STORAGE_KEY,
      present: safeGetItem(TOC_STORAGE_KEY) !== null,
      group: "school",
      label: `Terms acceptance (v${TOC_VERSION})`,
    },
    {
      key: AI_RISK_STORAGE_KEY,
      present: safeGetItem(AI_RISK_STORAGE_KEY) !== null,
      group: "school",
      label: "Legacy AI risk acceptance",
    },
    {
      key: AI_CHAT_PINNED_KEY,
      present: safeGetItem(AI_CHAT_PINNED_KEY) !== null,
      group: "school",
      label: "AI chat pin preference",
    },
  ];

  // Legacy pin keys only while still present (migration residue).
  for (const [key, label] of [
    [NOTES_PINNED_KEY, "Legacy notes pin preference"],
    [NOTES_PIN_SIDE_KEY, "Legacy notes pin side"],
  ] as const) {
    if (safeGetItem(key) !== null) {
      items.push({
        key,
        present: true,
        group: "school",
        label,
      });
    }
  }

  for (const key of VD3_THEME_KEYS) {
    items.push({
      key,
      present: safeGetItem(key) !== null,
      group: "theme",
      label: key.replace(/^ts-school-/, "Theme: "),
    });
  }

  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(MODEL_CACHE_FLAG_PREFIX)) {
          items.push({
            key,
            present: true,
            group: "model-cache-flag",
            label: `Model cache flag (${key.slice(MODEL_CACHE_FLAG_PREFIX.length)})`,
          });
        }
      }
    } catch {
      /* ignore */
    }
  }

  return items;
}

export function buildSchoolExport(
  exportedAt: Date = new Date(),
): SchoolExportV1 {
  const progressRaw = readJson(PROGRESS_STORAGE_KEY);
  const notesRaw = readJson(NOTES_STORAGE_KEY);
  const preferences: Record<string, string | null> = {};

  for (const key of [
    TOC_STORAGE_KEY,
    AI_RISK_STORAGE_KEY,
    AI_CHAT_PINNED_KEY,
    SCHOOL_AI_MODEL_ID_KEY,
    NOTES_WINDOW_STORAGE_KEY,
    NOTES_FOLDED_KEY,
    NOTES_PINNED_KEY,
    NOTES_PIN_SIDE_KEY,
    ...VD3_THEME_KEYS,
  ]) {
    preferences[key] = safeGetItem(key);
  }

  return {
    exportVersion: EXPORT_VERSION,
    exportedAt: exportedAt.toISOString(),
    progress: parseProgress(progressRaw) ?? null,
    notes: parseNotes(notesRaw) ?? null,
    preferences,
  };
}

export function exportFilename(at: Date = new Date()): string {
  const y = at.getUTCFullYear();
  const m = String(at.getUTCMonth() + 1).padStart(2, "0");
  const d = String(at.getUTCDate()).padStart(2, "0");
  return `typescript-school-export-${y}${m}${d}.json`;
}

/** Trigger a browser download of the export envelope (client-only). */
export function downloadSchoolExport(
  exportedAt: Date = new Date(),
): SchoolExportV1 {
  const payload = buildSchoolExport(exportedAt);
  if (typeof window === "undefined" || typeof document === "undefined") {
    return payload;
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = exportFilename(exportedAt);
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return payload;
}

function clearModelCacheFlags(): number {
  if (typeof window === "undefined") return 0;
  let count = 0;
  try {
    const toDelete: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(MODEL_CACHE_FLAG_PREFIX)) toDelete.push(key);
    }
    for (const key of toDelete) {
      window.localStorage.removeItem(key);
      count += 1;
    }
  } catch {
    return count;
  }
  return count;
}

export interface ClearModelCachesResult {
  deletedFlags: number;
  deletedCacheStores: number;
  deletedDatabases: number;
}

/**
 * Best-effort wipe of Cache Storage + IndexedDB names that look like model
 * artifacts, plus Labs `vdl-ai-chat-model-cached:*` flags.
 */
export async function clearModelCachesBestEffort(): Promise<ClearModelCachesResult> {
  const deletedFlags = clearModelCacheFlags();
  let deletedCacheStores = 0;
  let deletedDatabases = 0;

  if (typeof caches !== "undefined" && typeof caches.delete === "function") {
    try {
      if (await caches.delete(LITERT_MODEL_CACHE_NAME)) {
        deletedCacheStores += 1;
      }
    } catch {
      /* ignore */
    }
  }

  if (typeof caches !== "undefined" && typeof caches.keys === "function") {
    try {
      const keys = await caches.keys();
      for (const key of keys) {
        if (key === LITERT_MODEL_CACHE_NAME) continue;
        if (!isLikelyModelStorageName(key)) continue;
        const removed = await caches.delete(key);
        if (removed) deletedCacheStores += 1;
      }
    } catch {
      /* ignore */
    }
  }

  if (
    typeof indexedDB !== "undefined" &&
    typeof indexedDB.databases === "function" &&
    typeof indexedDB.deleteDatabase === "function"
  ) {
    try {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        const name = db?.name;
        if (!name || !isLikelyModelStorageName(name)) continue;
        await new Promise<void>((resolve) => {
          const req = indexedDB.deleteDatabase(name);
          req.onsuccess = () => {
            deletedDatabases += 1;
            resolve();
          };
          req.onerror = () => resolve();
          req.onblocked = () => resolve();
        });
      }
    } catch {
      /* ignore */
    }
  }

  return { deletedFlags, deletedCacheStores, deletedDatabases };
}

export interface ClearAllSchoolDataOptions {
  /** Clear session ToC declined flag. */
  clearTocDeclined?: boolean;
}

/**
 * Remove school-owned localStorage keys + site/legacy vd3 theme keys.
 * Does not touch in-memory Pinia — callers must reset stores / consent.
 */
export function clearSchoolLocalStorage(
  options: ClearAllSchoolDataOptions = {},
): void {
  for (const key of SCHOOL_STORAGE_KEYS) {
    safeRemoveItem(key);
  }
  for (const key of LEGACY_NOTES_PIN_KEYS) {
    safeRemoveItem(key);
  }
  // Clears `ts-school-*` theme keys and any leftover legacy `vanduo-*` keys.
  clearVd3ThemeStorageKeys();
  clearModelCacheFlags();
  if (
    options.clearTocDeclined !== false &&
    typeof sessionStorage !== "undefined"
  ) {
    try {
      sessionStorage.removeItem("ts-school-toc-declined");
    } catch {
      /* ignore */
    }
  }
}

export async function clearAllSchoolData(
  options: ClearAllSchoolDataOptions = {},
): Promise<ClearModelCachesResult> {
  clearSchoolLocalStorage(options);
  return clearModelCachesBestEffort();
}

/** Re-export schema constants useful for Profile copy / tests. */
export const hygieneSchema = {
  progressVersion: PROGRESS_SCHEMA_VERSION,
  notesVersion: NOTES_SCHEMA_VERSION,
  tocVersion: TOC_VERSION,
} as const;
