<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { VdToastContainer } from "@vanduo-oss/vd3";
import SchoolNavbar from "@/layout/SchoolNavbar.vue";
import SchoolFooter from "@/layout/SchoolFooter.vue";
import SchoolLayout from "@/layout/SchoolLayout.vue";
import GlobalSearchModal from "@/overlays/GlobalSearchModal.vue";
import DisclaimerGate from "@/overlays/DisclaimerGate.vue";
import { useDisclaimerConsent } from "@/composables/useDisclaimerConsent";
import { useAiChatStore } from "@/stores/aiChat";
import { useNotesStore } from "@/stores/notes";
import { useProgressStore } from "@/stores/progress";
import { useThemeStore } from "@/stores/theme";

const TsAiChatSidebar = defineAsyncComponent(
  () => import("@/overlays/TsAiChatSidebar.vue"),
);
const TsNotesModal = defineAsyncComponent(
  () => import("@/overlays/TsNotesModal.vue"),
);

const route = useRoute();
const router = useRouter();
const theme = useThemeStore();
const progress = useProgressStore();
const notes = useNotesStore();
const aiChat = useAiChatStore();
const { showGate, showFarewell, accept, decline, refresh } =
  useDisclaimerConsent();

// ── Per-route SEO (baked into the prerendered HTML via @unhead) ──────
const BRAND_TITLE = "TypeScript School";
const DEFAULT_DESCRIPTION =
  "TypeScript School teaches TypeScript by pairing the JavaScript that breaks with the TypeScript that fixes it — every diagnostic checked by the real compiler at build time.";

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

const isFarewellRoute = computed(
  () => route.name === "farewell" || route.path === "/farewell",
);

function goFarewell(): void {
  if (!isFarewellRoute.value) {
    void router.replace({ name: "farewell" });
  }
}

function onDecline(): void {
  decline();
  goFarewell();
}

function onAccept(): void {
  accept();
}

function openAiChat(): void {
  aiChat.openChat();
}

function openNotes(): void {
  notes.openNotes();
}

onMounted(() => {
  // Client only: theme, learner progress, notes, AI pin, and ToC consent hydrate
  // from localStorage/sessionStorage rather than serialised into the page,
  // because `script-src 'self'` blocks the inline script vite-ssg would use for
  // initial state.
  theme.init();
  progress.hydrate();
  notes.hydrate();
  aiChat.hydrate();
  refresh();
  if (showFarewell.value) goFarewell();
  window.addEventListener("ts:open-ai-chat", openAiChat);
  window.addEventListener("ts:open-notes", openNotes);
});

onUnmounted(() => {
  window.removeEventListener("ts:open-ai-chat", openAiChat);
  window.removeEventListener("ts:open-notes", openNotes);
});

watch(showFarewell, (declined) => {
  if (declined) goFarewell();
});
</script>

<template>
  <div
    class="ts-app-shell"
    :class="{
      'is-consent-locked': showGate,
      'is-farewell': isFarewellRoute,
      'is-ai-chat-pinned': aiChat.open && aiChat.pinned,
    }"
  >
    <template v-if="!isFarewellRoute">
      <a href="#main-content" class="skip-link">Skip to main content</a>

      <SchoolNavbar />

      <main id="main-content" :aria-hidden="showGate ? 'true' : undefined">
        <SchoolLayout v-if="isLesson">
          <RouterView />
        </SchoolLayout>
        <RouterView v-else />
      </main>

      <SchoolFooter />

      <GlobalSearchModal />
      <TsAiChatSidebar
        :open="aiChat.open"
        :pinned="aiChat.pinned"
        @close="aiChat.closeChat"
        @toggle-pin="aiChat.togglePin"
      />
      <TsNotesModal
        :open="notes.open"
        :folded="notes.folded"
        :geometry="notes.geometry"
        :body="notes.body"
        :near-soft-limit="notes.nearSoftLimit"
        @close="notes.closeNotes"
        @toggle-fold="notes.toggleFold"
        @update:body="notes.setBody"
        @update:geometry="notes.setWindow"
        @reclamp="notes.reclampToViewport"
      />
      <VdToastContainer />
    </template>

    <main v-else id="main-content" class="ts-app-main--farewell">
      <RouterView />
    </main>

    <DisclaimerGate v-if="showGate" @accept="onAccept" @decline="onDecline" />
  </div>
</template>
