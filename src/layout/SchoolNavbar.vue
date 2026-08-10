<script setup lang="ts">
/**
 * The site navbar: brand, the standalone pages, and three always-visible
 * actions (search, theme customiser, theme switcher).
 *
 * Hand-assembled from the package's `vd-navbar-*` classes rather than composing
 * its `VdNavbar` component, and `vd3-docs` does the same thing for the same
 * reason: `VdNavbar` renders its `actions` slot *inside* `.vd-navbar-menu`, and
 * marks that element `aria-hidden` whenever the mobile menu is closed. Above
 * the breakpoint the menu is visible, so the actions end up visible and hidden
 * from assistive technology at once — which Chrome flags the moment one of them
 * takes focus. Keeping the actions outside the collapsible menu fixes that and
 * is the behaviour we want anyway: search and theme controls should not be
 * behind a hamburger.
 *
 * Everything else — the glass-on-scroll treatment, the mobile drawer, the
 * burger animation — is the package's CSS, driven by its own class names and
 * its `useNavbarGlassScroll` composable.
 */
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useNavbarGlassScroll, VdThemeCustomizer } from "@vanduo-oss/vd3";
import SchoolBrandMark from "@/components/SchoolBrandMark.vue";
import SchoolThemeSwitcher from "@/overlays/SchoolThemeSwitcher.vue";
import { nav } from "@/nav";

const route = useRoute();
const navRef = ref<HTMLElement | null>(null);
const isScrolled = useNavbarGlassScroll(navRef);
const menuOpen = ref(false);

// The nav tree already declares the standalone pages. Home is the brand link;
// Profile is the actions icon — neither is listed a second time in the text row.
const links = nav.pages.filter(
  (page) => page.route !== "/" && page.route !== "/profile",
);

const closeMenu = (): void => {
  menuOpen.value = false;
};

watch(() => route.path, closeMenu);

const openSearch = (): void => {
  closeMenu();
  window.dispatchEvent(new CustomEvent("ts:open-search"));
};

const openAsk = (): void => {
  closeMenu();
  window.dispatchEvent(new CustomEvent("ts:open-ai-chat"));
};

const openNotes = (): void => {
  closeMenu();
  window.dispatchEvent(new CustomEvent("ts:open-notes"));
};
</script>

<template>
  <nav
    ref="navRef"
    class="vd-navbar vd-navbar-fixed vd-navbar-glass"
    :class="{ 'vd-navbar-scrolled': isScrolled }"
    aria-label="Primary"
  >
    <div class="vd-navbar-container">
      <div class="vd-navbar-brand">
        <RouterLink to="/" class="ts-brand-link" @click="closeMenu">
          <SchoolBrandMark size="2rem" />
          <span class="ts-brand-text">
            <span class="ts-brand-name">TypeScript</span>
            <span class="ts-brand-word">School</span>
          </span>
        </RouterLink>
      </div>

      <div
        id="ts-navbar-menu"
        class="vd-navbar-menu"
        :class="{ 'is-open': menuOpen }"
      >
        <ul class="vd-navbar-nav">
          <li v-for="link in links" :key="link.route">
            <RouterLink
              :to="link.route"
              class="vd-nav-link"
              active-class="active"
              @click="closeMenu"
            >
              {{ link.title }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="vd-navbar-actions ts-navbar-actions">
        <button
          type="button"
          class="vd-theme-switcher-toggle"
          aria-label="Open study notes"
          data-testid="ts-open-notes"
          @click="openNotes"
        >
          <i class="ph ph-note" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="vd-theme-switcher-toggle"
          aria-label="Ask the lesson assistant"
          data-testid="ts-open-ai-chat"
          @click="openAsk"
        >
          <i class="ph ph-chat-circle" aria-hidden="true"></i>
        </button>
        <RouterLink
          to="/profile"
          class="vd-theme-switcher-toggle"
          aria-label="Open profile"
          data-testid="ts-open-profile"
          @click="closeMenu"
        >
          <i class="ph ph-user" aria-hidden="true"></i>
        </RouterLink>
        <button
          type="button"
          class="vd-theme-switcher-toggle"
          aria-label="Search the curriculum"
          aria-keyshortcuts="Meta+K Control+K"
          @click="openSearch"
        >
          <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
        </button>
        <VdThemeCustomizer :show-palette="false" />
        <SchoolThemeSwitcher />
      </div>

      <button
        type="button"
        class="vd-navbar-toggle"
        :class="{ 'is-active': menuOpen }"
        aria-label="Toggle navigation"
        :aria-expanded="menuOpen"
        aria-controls="ts-navbar-menu"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
</template>
