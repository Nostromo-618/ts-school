import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  useThemePreference,
  type Palette,
  type RadiusOption,
  type ThemeMode,
} from "@vanduo-oss/vd3";

/**
 * Site theme policy.
 *
 * Ported in shape from `vd3-docs/src/stores/theme.ts`, but not in substance.
 * The donor predates the package's `useThemePreference()` singleton and owns
 * the preference state itself; here the singleton is the only writer of the
 * `data-*` attributes and the `vanduo-*` storage keys, and this store is a thin
 * layer of site policy over it.
 *
 * That matters because the shell renders the package's `VdThemeSwitcher` *and*
 * its `VdThemeCustomizer` at the same time. Two independent writers of the same
 * preference would only misbehave when both are on screen — which is exactly
 * the configuration this site ships.
 *
 * The one policy the site adds is a per-mode default neutral: stone in light,
 * charcoal in dark, following the mode while the neutral is still one of
 * those two defaults. An explicit pick sticks across mode changes. Default
 * primary, radius, font, and the single-key NEUTRAL baseline (`stone`) are
 * not this store's business — `main.ts` registers them through `VanduoVue`'s
 * `themeDefaults` (vd3 has no NEUTRAL_LIGHT / NEUTRAL_DARK).
 */

/** Site defaults, tracked per scheme because the engine has a single NEUTRAL. */
const NEUTRAL_DEFAULTS = { light: "stone", dark: "charcoal" } as const;

export const useThemeStore = defineStore("theme", () => {
  const preference = useThemePreference();
  const prefs = preference.state;
  const ready = ref(false);

  const resolveScheme = (theme: ThemeMode): "light" | "dark" => {
    if (theme !== "system") return theme;
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const defaultNeutral = (theme: ThemeMode): string =>
    NEUTRAL_DEFAULTS[resolveScheme(theme)];

  /** True while the reader has not chosen a neutral of their own. */
  const isDefaultNeutral = (neutral: string): boolean =>
    neutral === NEUTRAL_DEFAULTS.light || neutral === NEUTRAL_DEFAULTS.dark;

  /**
   * Hydrate and apply site policy. Called once from `App.vue`'s `onMounted`:
   * the singleton reads storage synchronously on access, so all this adds is
   * the neutral default, and it must not run during the prerender.
   */
  const init = (): void => {
    if (ready.value) return;
    if (isDefaultNeutral(prefs.neutral)) {
      preference.setNeutral(defaultNeutral(prefs.theme));
    }
    ready.value = true;
  };

  const setTheme = (theme: ThemeMode): void => {
    // Keep the auto-following neutral in step with the newly chosen scheme.
    if (isDefaultNeutral(prefs.neutral)) {
      preference.setNeutral(defaultNeutral(theme));
    }
    preference.setTheme(theme);
  };

  const reset = (): void => {
    preference.reset();
    preference.setNeutral(defaultNeutral(prefs.theme));
  };

  return {
    prefs,
    ready,
    palette: computed(() => prefs.palette),
    theme: computed(() => prefs.theme),
    primary: computed(() => prefs.primary),
    neutral: computed(() => prefs.neutral),
    radius: computed(() => prefs.radius),
    font: computed(() => prefs.font),
    init,
    setTheme,
    setPalette: (palette: Palette): void => preference.setPalette(palette),
    setPrimary: (primary: string): void => preference.setPrimary(primary),
    setNeutral: (neutral: string): void => preference.setNeutral(neutral),
    setRadius: (radius: RadiusOption): void => preference.setRadius(radius),
    setFont: (font: string): void => preference.setFont(font),
    reset,
  };
});
