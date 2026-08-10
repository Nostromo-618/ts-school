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

  it("remaps known legacy keys to ts-school-*", () => {
    expect(remapVd3ThemeStorageKey("vanduo-theme-preference")).toBe(
      "ts-school-theme-preference",
    );
    expect(remapVd3ThemeStorageKey("vanduo-font-preference")).toBe(
      "ts-school-font-preference",
    );
    expect(remapVd3ThemeStorageKey("ts-school-progress")).toBe(
      "ts-school-progress",
    );
  });

  it("migrates legacy values once and removes vanduo-* keys", () => {
    const raw = memoryRaw();
    raw.setItem("vanduo-theme-preference", "dark");
    raw.setItem("vanduo-radius", "0.5");
    raw.setItem("ts-school-palette", "keep-me");

    migrateVd3ThemeStorageKeys(raw);

    expect(raw.getItem("ts-school-theme-preference")).toBe("dark");
    expect(raw.getItem("ts-school-radius")).toBe("0.5");
    expect(raw.getItem("ts-school-palette")).toBe("keep-me");
    for (const key of LEGACY_VD3_THEME_KEYS) {
      expect(raw.getItem(key)).toBeNull();
    }
  });

  it("does not overwrite an existing site key during migration", () => {
    const raw = memoryRaw();
    raw.setItem("vanduo-theme-preference", "dark");
    raw.setItem("ts-school-theme-preference", "light");

    migrateVd3ThemeStorageKeys(raw);

    expect(raw.getItem("ts-school-theme-preference")).toBe("light");
    expect(raw.getItem("vanduo-theme-preference")).toBeNull();
  });

  it("clear removes both site and legacy theme keys", () => {
    const raw = memoryRaw();
    for (const key of VD3_THEME_KEYS) raw.setItem(key, "x");
    for (const key of LEGACY_VD3_THEME_KEYS) raw.setItem(key, "y");

    clearVd3ThemeStorageKeys(raw);

    for (const key of VD3_THEME_KEYS) expect(raw.getItem(key)).toBeNull();
    for (const key of LEGACY_VD3_THEME_KEYS) expect(raw.getItem(key)).toBeNull();
  });

  it("routes live localStorage writes for vanduo-* through to ts-school-*", () => {
    window.localStorage.setItem("vanduo-theme-preference", "dark");

    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key) keys.push(key);
    }
    expect(keys).toContain("ts-school-theme-preference");
    expect(keys).not.toContain("vanduo-theme-preference");
    expect(window.localStorage.getItem("ts-school-theme-preference")).toBe(
      "dark",
    );
    // Remapped read still works for vd3's hardcoded key name.
    expect(window.localStorage.getItem("vanduo-theme-preference")).toBe("dark");
  });
});
