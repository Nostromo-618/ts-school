import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AI_RISK_STORAGE_KEY,
  AI_RISK_VERSION,
} from "@/content/ai-disclaimer";
import { TOC_STORAGE_KEY, TOC_VERSION } from "@/content/disclaimer";
import {
  MODEL_CACHE_FLAG_PREFIX,
  NON_CLEARABLE_SURFACES,
  buildLocalDataInventory,
  buildSchoolExport,
  clearAllSchoolData,
  clearSchoolLocalStorage,
  exportFilename,
  isLikelyModelStorageName,
} from "@/lib/data-hygiene";
import { NOTES_STORAGE_KEY } from "@/stores/notes";
import { PROGRESS_STORAGE_KEY } from "@/stores/progress";
import { AI_CHAT_PINNED_KEY } from "@/stores/aiChat";

describe("data hygiene", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("builds an export envelope with progress and notes", () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        lessons: {
          "why-types": {
            status: "complete",
            updatedAt: "2026-08-10T12:00:00.000Z",
          },
        },
      }),
    );
    window.localStorage.setItem(
      NOTES_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        body: "my notes",
        updatedAt: "2026-08-10T12:00:00.000Z",
      }),
    );
    window.localStorage.setItem(
      TOC_STORAGE_KEY,
      JSON.stringify({ version: TOC_VERSION, acceptedAt: "2026-08-10T00:00:00.000Z" }),
    );
    window.localStorage.setItem(AI_CHAT_PINNED_KEY, "1");

    const exported = buildSchoolExport(new Date("2026-08-10T15:00:00.000Z"));
    expect(exported.exportVersion).toBe(1);
    expect(exported.exportedAt).toBe("2026-08-10T15:00:00.000Z");
    expect(exported.progress?.lessons["why-types"]?.status).toBe("complete");
    expect(exported.notes?.body).toBe("my notes");
    expect(exported.preferences[TOC_STORAGE_KEY]).toContain(TOC_VERSION);
    expect(exported.preferences[AI_CHAT_PINNED_KEY]).toBe("1");
    expect(exportFilename(new Date("2026-08-10T15:00:00.000Z"))).toBe(
      "typescript-school-export-20260810.json",
    );
  });

  it("inventories present school keys", () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, "{}");
    window.localStorage.setItem(NOTES_STORAGE_KEY, "{}");
    window.localStorage.setItem(`${MODEL_CACHE_FLAG_PREFIX}gemma-4-E2B-it-web`, "1");
    const items = buildLocalDataInventory();
    expect(
      items.find((i) => i.key === PROGRESS_STORAGE_KEY)?.present,
    ).toBe(true);
    expect(items.find((i) => i.key === NOTES_STORAGE_KEY)?.present).toBe(true);
    expect(
      items.some((i) => i.key.startsWith(MODEL_CACHE_FLAG_PREFIX) && i.present),
    ).toBe(true);
  });

  it("clearSchoolLocalStorage removes school + theme + model flags", () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, "x");
    window.localStorage.setItem(NOTES_STORAGE_KEY, "x");
    window.localStorage.setItem(AI_RISK_STORAGE_KEY, "x");
    window.localStorage.setItem("vanduo-theme-preference", "dark");
    window.localStorage.setItem(`${MODEL_CACHE_FLAG_PREFIX}gemma`, "1");
    window.sessionStorage.setItem("ts-school-toc-declined", TOC_VERSION);

    clearSchoolLocalStorage();

    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(NOTES_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(AI_RISK_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem("vanduo-theme-preference")).toBeNull();
    expect(
      window.localStorage.getItem(`${MODEL_CACHE_FLAG_PREFIX}gemma`),
    ).toBeNull();
    expect(window.sessionStorage.getItem("ts-school-toc-declined")).toBeNull();
  });

  it("clearAllSchoolData best-effort deletes likely caches", async () => {
    const deleteFn = vi.fn().mockResolvedValue(true);
    const keysFn = vi.fn().mockResolvedValue(["webllm-model-cache", "unrelated"]);
    vi.stubGlobal("caches", { keys: keysFn, delete: deleteFn });

    const deleteDatabase = vi.fn(() => {
      const req = {
        onsuccess: null as (() => void) | null,
        onerror: null as (() => void) | null,
        onblocked: null as (() => void) | null,
      };
      queueMicrotask(() => req.onsuccess?.());
      return req;
    });
    vi.stubGlobal("indexedDB", {
      databases: vi.fn().mockResolvedValue([
        { name: "litert-model-db" },
        { name: "app-settings" },
      ]),
      deleteDatabase,
    });

    window.localStorage.setItem(PROGRESS_STORAGE_KEY, "x");
    const result = await clearAllSchoolData();
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    expect(deleteFn).toHaveBeenCalledWith("webllm-model-cache");
    expect(deleteFn).not.toHaveBeenCalledWith("unrelated");
    expect(deleteDatabase).toHaveBeenCalledWith("litert-model-db");
    expect(result.deletedCacheStores).toBe(1);
    expect(result.deletedDatabases).toBe(1);
    vi.unstubAllGlobals();
  });

  it("documents non-clearable surfaces and matches Labs name heuristic", () => {
    expect(NON_CLEARABLE_SURFACES.length).toBeGreaterThan(0);
    expect(isLikelyModelStorageName("mlc-webllm-cache")).toBe(true);
    expect(isLikelyModelStorageName("gemma-4-cache")).toBe(true);
    expect(isLikelyModelStorageName("user-prefs")).toBe(false);
    expect(AI_RISK_VERSION).toBeTruthy();
  });
});
