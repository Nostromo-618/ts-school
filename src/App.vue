<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { VdToastContainer } from "@vanduo-oss/vd3";
import SchoolNavbar from "@/layout/SchoolNavbar.vue";
import SchoolFooter from "@/layout/SchoolFooter.vue";
import SchoolLayout from "@/layout/SchoolLayout.vue";
import GlobalSearchModal from "@/overlays/GlobalSearchModal.vue";
import { useThemeStore } from "@/stores/theme";

const route = useRoute();
const theme = useThemeStore();

// ── Per-route SEO (baked into the prerendered HTML via @unhead) ──────
const BRAND_TITLE = "TypeScript School";
const DEFAULT_DESCRIPTION =
  "TypeScript School teaches TypeScript by pairing the JavaScript that breaks with the TypeScript that fixes it — every diagnostic checked by the real compiler.";

const pageTitle = computed(() => {
  const t = route.meta?.title as string | undefined;
  if (route.path === "/" || !t || t === BRAND_TITLE) return BRAND_TITLE;
  return `${t} — ${BRAND_TITLE}`;
});

const pageDescription = computed(() => {
  const d = route.meta?.description as string | undefined;
  return d ?? DEFAULT_DESCRIPTION;
});

useHead({
  title: pageTitle,
  meta: [
    { name: "description", content: pageDescription },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: pageDescription },
  ],
});

/** Lesson routes get the sidebar; everything else is full width. */
const isLesson = computed(() => route.meta?.layout === "lesson");

onMounted(() => {
  // Client only: the theme is hydrated from localStorage rather than
  // serialised into the page, because `script-src 'self'` blocks the inline
  // script vite-ssg would use for initial state.
  theme.init();
});
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <SchoolNavbar />

  <main id="main-content">
    <SchoolLayout v-if="isLesson">
      <RouterView />
    </SchoolLayout>
    <RouterView v-else />
  </main>

  <SchoolFooter />

  <GlobalSearchModal />
  <VdToastContainer />
</template>
