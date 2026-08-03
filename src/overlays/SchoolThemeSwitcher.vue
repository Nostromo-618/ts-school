<script setup lang="ts">
/**
 * Light / dark / system switcher.
 *
 * Ported from `vd3-docs/src/overlays/VdThemeSwitcher.vue` rather than using the
 * package's `VdThemeSwitcher`, for one reason: the package's version marks its
 * menu `aria-hidden` while the menu is closed, and selecting an option closes
 * it with focus still inside — which Chrome reports as
 * "Blocked aria-hidden on an element because its descendant retained focus".
 * The menu is already `display: none` when closed, so the attribute buys
 * nothing and the port simply omits it, and returns focus to the toggle after a
 * choice.
 *
 * Markup and classes are the package's own `vd-theme-switcher-*` contract, so
 * it is styled entirely by `@vanduo-oss/vd3` and stays in visual step with the
 * theme customizer beside it. Writes go through the theme store, which
 * delegates to the same `useThemePreference()` singleton the customizer uses —
 * so the two controls can never disagree.
 */
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { ThemeMode } from "@vanduo-oss/vd3";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const root = ref<HTMLElement | null>(null);
const toggleRef = ref<HTMLButtonElement | null>(null);
const isOpen = ref(false);

const options: { value: ThemeMode; icon: string; label: string }[] = [
  { value: "system", icon: "ph-desktop", label: "Use system preference" },
  { value: "light", icon: "ph-sun", label: "Light theme" },
  { value: "dark", icon: "ph-moon", label: "Dark theme" },
];

const current = computed(
  () => options.find((option) => option.value === theme.theme) ?? options[0],
);

const toggle = (): void => {
  isOpen.value = !isOpen.value;
};

const choose = (mode: ThemeMode): void => {
  theme.setTheme(mode);
  isOpen.value = false;
  // The option that was just clicked is about to be display:none; park focus
  // back on the control that owns it rather than letting it fall to <body>.
  toggleRef.value?.focus();
};

const onDocClick = (event: MouseEvent): void => {
  if (root.value && !root.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === "Escape" && isOpen.value) {
    isOpen.value = false;
    toggleRef.value?.focus();
  }
};

onMounted(() => {
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div
    ref="root"
    class="vd-theme-switcher vd-theme-switcher-menu-end"
    :class="{ 'is-open': isOpen }"
    data-theme-ui="menu"
  >
    <button
      ref="toggleRef"
      type="button"
      class="vd-theme-switcher-toggle"
      :aria-label="`Theme: ${current.label}`"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <i
        class="ph"
        :class="current.icon"
        data-theme-icon
        aria-hidden="true"
      ></i>
    </button>
    <div class="vd-theme-switcher-menu" role="menu">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="menuitemradio"
        class="vd-theme-switcher-option"
        :class="{ 'is-active': theme.theme === option.value }"
        :data-theme-value="option.value"
        :aria-checked="theme.theme === option.value"
        :aria-label="option.label"
        @click="choose(option.value)"
      >
        <i class="ph" :class="option.icon" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>
