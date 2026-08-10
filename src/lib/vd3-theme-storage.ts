/**
 * Isolate vd3 theme prefs from other Vanduo sites on the same origin.
 *
 * `@vanduo-oss/vd3` 1.2.2 hardcodes localStorage keys with a `vanduo-` prefix
 * (`VanduoVue` / `ThemeDefaults` expose no `storagePrefix`). Until upstream
 * adds a configurable prefix, this module remaps those keys to `ts-school-`
 * by wrapping `Storage.prototype` get/set/remove for `localStorage` only.
 *
 * Call `installVd3ThemeStoragePrefix()` once on the client **before**
 * `useThemePreference()` hydrates (see `main.ts` and Vitest setup). Migration
 * copies any existing `vanduo-*` theme values to `ts-school-*` and deletes the
 * legacy keys so this site stops writing `vanduo-*`.
 *
 * Survives vd3 upgrades that keep calling `vanduo-*` key names: the wrapper
 * stays in app code. If vd3 later adds an official prefix option, prefer that
 * and retire this shim.
 */

export const VD3_LEGACY_STORAGE_PREFIX = "vanduo-" as const;
export const VD3_SITE_STORAGE_PREFIX = "ts-school-" as const;

/**
 * Suffixes of the six keys vd3 persists today (`useTheme` STORAGE_KEYS).
 * Remap is suffix-scoped so unrelated future `vanduo-*` keys (if any) are
 * untouched; extend this list if vd3 adds theme storage keys.
 */
export const VD3_THEME_KEY_SUFFIXES = [
  "theme-preference",
  "palette",
  "primary-color",
  "neutral-color",
  "radius",
  "font-preference",
] as const;

export type Vd3ThemeKeySuffix = (typeof VD3_THEME_KEY_SUFFIXES)[number];

export const VD3_THEME_KEYS = [
  "ts-school-theme-preference",
  "ts-school-palette",
  "ts-school-primary-color",
  "ts-school-neutral-color",
  "ts-school-radius",
  "ts-school-font-preference",
] as const;

export const LEGACY_VD3_THEME_KEYS = [
  "vanduo-theme-preference",
  "vanduo-palette",
  "vanduo-primary-color",
  "vanduo-neutral-color",
  "vanduo-radius",
  "vanduo-font-preference",
] as const;

const LEGACY_THEME_KEY_SET: ReadonlySet<string> = new Set(LEGACY_VD3_THEME_KEYS);

export function isVd3LegacyThemeKey(key: string): boolean {
  return LEGACY_THEME_KEY_SET.has(key);
}

/** Map a vd3 legacy key to the site key; other keys pass through. */
export function remapVd3ThemeStorageKey(key: string): string {
  if (!isVd3LegacyThemeKey(key)) return key;
  return `${VD3_SITE_STORAGE_PREFIX}${key.slice(VD3_LEGACY_STORAGE_PREFIX.length)}`;
}

type StorageGetItem = (this: Storage, key: string) => string | null;
type StorageSetItem = (this: Storage, key: string, value: string) => void;
type StorageRemoveItem = (this: Storage, key: string) => void;

interface RawLocalStorageFns {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

let rawLocalStorage: RawLocalStorageFns | null = null;
let installed = false;

function bindRawLocalStorage(
  storage: Storage,
  getItem: StorageGetItem,
  setItem: StorageSetItem,
  removeItem: StorageRemoveItem,
): RawLocalStorageFns {
  return {
    getItem: (key) => getItem.call(storage, key),
    setItem: (key, value) => {
      setItem.call(storage, key, value);
    },
    removeItem: (key) => {
      removeItem.call(storage, key);
    },
  };
}

/**
 * One-shot migrate: copy `vanduo-*` theme values → `ts-school-*` when the
 * site key is absent, then remove the legacy keys.
 */
export function migrateVd3ThemeStorageKeys(
  raw: RawLocalStorageFns | null = rawLocalStorage,
): void {
  if (!raw) return;
  for (const legacyKey of LEGACY_VD3_THEME_KEYS) {
    let legacyValue: string | null;
    try {
      legacyValue = raw.getItem(legacyKey);
    } catch {
      continue;
    }
    if (legacyValue === null) continue;
    const siteKey = remapVd3ThemeStorageKey(legacyKey);
    try {
      if (raw.getItem(siteKey) === null) {
        raw.setItem(siteKey, legacyValue);
      }
      raw.removeItem(legacyKey);
    } catch {
      /* quota / privacy mode — leave legacy in place for a later visit */
    }
  }
}

/** Remove site + leftover legacy vd3 theme keys (bypasses the remap wrapper). */
export function clearVd3ThemeStorageKeys(
  raw: RawLocalStorageFns | null = rawLocalStorage,
): void {
  const remove = (key: string): void => {
    try {
      if (raw) {
        raw.removeItem(key);
      } else if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
  };
  for (const key of VD3_THEME_KEYS) remove(key);
  for (const key of LEGACY_VD3_THEME_KEYS) remove(key);
}

/**
 * Install the localStorage remapper + migrate legacy keys. Idempotent.
 * No-ops during SSR / when `window.localStorage` is unavailable.
 */
export function installVd3ThemeStoragePrefix(): void {
  if (installed) return;
  if (typeof window === "undefined" || typeof Storage === "undefined") return;
  if (!window.localStorage) return;

  const proto = Storage.prototype;
  const nativeGetItem = proto.getItem;
  const nativeSetItem = proto.setItem;
  const nativeRemoveItem = proto.removeItem;

  rawLocalStorage = bindRawLocalStorage(
    window.localStorage,
    nativeGetItem,
    nativeSetItem,
    nativeRemoveItem,
  );

  migrateVd3ThemeStorageKeys(rawLocalStorage);

  proto.getItem = function patchedGetItem(
    this: Storage,
    key: string,
  ): string | null {
    const resolved =
      this === window.localStorage ? remapVd3ThemeStorageKey(key) : key;
    return nativeGetItem.call(this, resolved);
  };

  proto.setItem = function patchedSetItem(
    this: Storage,
    key: string,
    value: string,
  ): void {
    const resolved =
      this === window.localStorage ? remapVd3ThemeStorageKey(key) : key;
    nativeSetItem.call(this, resolved, value);
  };

  proto.removeItem = function patchedRemoveItem(
    this: Storage,
    key: string,
  ): void {
    if (this === window.localStorage) {
      const siteKey = remapVd3ThemeStorageKey(key);
      nativeRemoveItem.call(this, siteKey);
      if (isVd3LegacyThemeKey(key)) {
        nativeRemoveItem.call(this, key);
      }
      return;
    }
    nativeRemoveItem.call(this, key);
  };

  installed = true;
}

/** Test helper: whether the remapper is active. */
export function isVd3ThemeStoragePrefixInstalled(): boolean {
  return installed;
}
