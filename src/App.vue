<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useHead } from "@unhead/vue";

const route = useRoute();

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
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- The docs shell (navbar, sidebar, footer, overlays) wraps this outlet in
       the port-docs-shell change; until then the router renders bare. -->
  <main id="main-content">
    <RouterView />
  </main>
</template>
