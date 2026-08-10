<script setup lang="ts">
/**
 * Light / dark / system cycle control.
 *
 * A single click advances to the next mode (system → light → dark → system).
 * Ported from the package's theme-switcher surface rather than using
 * `VdThemeSwitcher`, so we keep the `vd-theme-switcher-*` classes (styled by
 * `@vanduo-oss/vd3`) without the package menu's aria-hidden focus quirk.
 *
 * Writes go through the theme store, which delegates to the same
 * `useThemePreference()` singleton the customizer uses — so the two controls
 * can never disagree.
 */
import { computed } from "vue";
import type { ThemeMode } from "@vanduo-oss/vd3";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();

/** Cycle order: system → light → dark → system. */
const options: { value: ThemeMode; icon: string; shortLabel: string }[] = [
  { value: "system", icon: "ph-desktop", shortLabel: "system" },
  { value: "light", icon: "ph-sun", shortLabel: "light" },
  { value: "dark", icon: "ph-moon", shortLabel: "dark" },
];

const current = computed(
  () => options.find((option) => option.value === theme.theme) ?? options[0],
);

const ariaLabel = computed(
  () => `Theme: ${current.value.shortLabel}. Click to cycle.`,
);

const cycle = (): void => {
  const index = options.findIndex((option) => option.value === theme.theme);
  const nextIndex = (index + 1) % options.length;
  const next = options[nextIndex] ?? options[0];
  theme.setTheme(next.value);
};
</script>

<template>
  <div class="vd-theme-switcher" data-theme-ui="cycle">
    <button
      type="button"
      class="vd-theme-switcher-toggle"
      :aria-label="ariaLabel"
      data-theme-cycle
      @click="cycle"
    >
      <i
        class="ph"
        :class="current.icon"
        data-theme-icon
        aria-hidden="true"
      ></i>
    </button>
  </div>
</template>
