import { beforeEach, describe, expect, it } from "vitest";

import {
  LEGACY_VD3_THEME_KEYS,
  VD3_THEME_KEYS,
  clearVd3ThemeStorageKeys,
  isVd3ThemeStoragePrefixInstalled,
  migrateVd3ThemeStorageKeys,
  remapVd3ThemeStorageKey,
} from "@/lib/vd3-theme-storage";

function memoryRaw() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    keys: () => [...store.keys()],
    snapshot: () => new Map(store),
  };
}

describe("vd3 theme storage prefix", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("is installed by Vitest setup before theme tests run", () => {
    expect(isVd3ThemeStoragePrefixInstalled()).toBe(true);
  });

  it("remaps any vanduo-* key to ts-school-* via prefix rule", () => {
    expect(remapVd3ThemeStorageKey("vanduo-theme-preference")).toBe(
      "ts-school-theme-preference",
    );
    expect(remapVd3ThemeStorageKey("vanduo-font-preference")).toBe(
      "ts-school-font-preference",
    );
    expect(remapVd3ThemeStorageKey("vanduo-future-setting")).toBe(
      "ts-school-future-setting",
    );
    expect(remapVd3ThemeStorageKey("ts-school-progress")).toBe(
      "ts-school-progress",
    );
    expect(remapVd3ThemeStorageKey("other-key")).toBe("other-key");
  });

  it("migrates all vanduo-* values once and removes legacy keys", () => {
    const raw = memoryRaw();
    raw.setItem("vanduo-theme-preference", "dark");
    raw.setItem("vanduo-radius", "0.5");
    raw.setItem("vanduo-future-setting", "new-vd3-pref");
    raw.setItem("ts-school-palette", "keep-me");
    raw.setItem("ts-school-progress", "school-data");

    migrateVd3ThemeStorageKeys(raw);

    expect(raw.getItem("ts-school-theme-preference")).toBe("dark");
    expect(raw.getItem("ts-school-radius")).toBe("0.5");
    expect(raw.getItem("ts-school-future-setting")).toBe("new-vd3-pref");
    expect(raw.getItem("ts-school-palette")).toBe("keep-me");
    expect(raw.getItem("ts-school-progress")).toBe("school-data");
    for (const key of LEGACY_VD3_THEME_KEYS) {
      expect(raw.getItem(key)).toBeNull();
    }
    expect(raw.getItem("vanduo-future-setting")).toBeNull();
  });

  it("does not overwrite an existing site key during migration", () => {
    const raw = memoryRaw();
    raw.setItem("vanduo-theme-preference", "dark");
    raw.setItem("ts-school-theme-preference", "light");
    raw.setItem("vanduo-future-setting", "from-legacy");
    raw.setItem("ts-school-future-setting", "already-here");

    migrateVd3ThemeStorageKeys(raw);

    expect(raw.getItem("ts-school-theme-preference")).toBe("light");
    expect(raw.getItem("vanduo-theme-preference")).toBeNull();
    expect(raw.getItem("ts-school-future-setting")).toBe("already-here");
    expect(raw.getItem("vanduo-future-setting")).toBeNull();
  });

  it("clear removes theme + remapped future keys but keeps school keys", () => {
    const raw = memoryRaw();
    for (const key of VD3_THEME_KEYS) raw.setItem(key, "x");
    for (const key of LEGACY_VD3_THEME_KEYS) raw.setItem(key, "y");
    raw.setItem("ts-school-future-setting", "z");
    raw.setItem("vanduo-future-setting", "w");
    raw.setItem("ts-school-progress", "keep");
    raw.setItem("ts-school-notes", "keep-notes");
    raw.setItem("ts-school-notes-window", "keep-window");
    raw.setItem("ts-school-notes-folded", "1");

    clearVd3ThemeStorageKeys(raw);

    for (const key of VD3_THEME_KEYS) expect(raw.getItem(key)).toBeNull();
    for (const key of LEGACY_VD3_THEME_KEYS) expect(raw.getItem(key)).toBeNull();
    expect(raw.getItem("ts-school-future-setting")).toBeNull();
    expect(raw.getItem("vanduo-future-setting")).toBeNull();
    expect(raw.getItem("ts-school-progress")).toBe("keep");
    expect(raw.getItem("ts-school-notes")).toBe("keep-notes");
    expect(raw.getItem("ts-school-notes-window")).toBe("keep-window");
    expect(raw.getItem("ts-school-notes-folded")).toBe("1");
  });

  it("routes live localStorage writes for vanduo-* through to ts-school-*", () => {
    window.localStorage.setItem("vanduo-theme-preference", "dark");
    window.localStorage.setItem("vanduo-future-setting", "ahead");

    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key) keys.push(key);
    }
    expect(keys).toContain("ts-school-theme-preference");
    expect(keys).toContain("ts-school-future-setting");
    expect(keys).not.toContain("vanduo-theme-preference");
    expect(keys).not.toContain("vanduo-future-setting");
    expect(window.localStorage.getItem("ts-school-theme-preference")).toBe(
      "dark",
    );
    expect(window.localStorage.getItem("ts-school-future-setting")).toBe(
      "ahead",
    );
    // Remapped read still works for vd3's hardcoded key name.
    expect(window.localStorage.getItem("vanduo-theme-preference")).toBe("dark");
    expect(window.localStorage.getItem("vanduo-future-setting")).toBe("ahead");
  });

  it("does not rewrite school-owned ts-school-* keys on live storage", () => {
    window.localStorage.setItem("ts-school-progress", '{"v":1}');
    expect(window.localStorage.getItem("ts-school-progress")).toBe('{"v":1}');
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key) keys.push(key);
    }
    expect(keys).toContain("ts-school-progress");
    expect(keys.some((k) => k.startsWith("vanduo-"))).toBe(false);
  });
});
