<script setup lang="ts">
/**
 * Mandatory AI risk gate when opening Ask. Pattern matches DisclaimerGate:
 * Accept / Decline only; Escape declines; focus trapped in the panel.
 */
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import {
  AI_RISK_INTRO,
  AI_RISK_SECTIONS,
  AI_RISK_TITLE,
  AI_RISK_VERSION,
} from "@/content/ai-disclaimer";

const emit = defineEmits<{
  accept: [];
  decline: [];
}>();

const panelRef = ref<HTMLElement | null>(null);
const acceptRef = ref<HTMLButtonElement | null>(null);
let previousFocus: HTMLElement | null = null;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function focusableInPanel(): HTMLElement[] {
  if (!panelRef.value) return [];
  return Array.from(panelRef.value.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("decline");
    return;
  }
  if (event.key !== "Tab" || !panelRef.value) return;
  const nodes = focusableInPanel();
  if (nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

onMounted(async () => {
  previousFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  window.addEventListener("keydown", onKeydown);
  await nextTick();
  acceptRef.value?.focus();
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  previousFocus?.focus();
});

watch(panelRef, async (el) => {
  if (!el) return;
  await nextTick();
  acceptRef.value?.focus();
});
</script>

<template>
  <div
    class="ts-consent-overlay ts-ai-risk-overlay"
    data-testid="ai-risk-gate"
    role="dialog"
    aria-modal="true"
    aria-labelledby="ai-risk-gate-title"
  >
    <div ref="panelRef" class="ts-consent-panel" tabindex="-1">
      <header class="ts-consent-header">
        <h1 id="ai-risk-gate-title">{{ AI_RISK_TITLE }}</h1>
        <p class="ts-consent-version">AI risk version {{ AI_RISK_VERSION }}</p>
        <p>{{ AI_RISK_INTRO }}</p>
      </header>

      <div class="ts-consent-body">
        <section
          v-for="section in AI_RISK_SECTIONS"
          :key="section.heading"
          class="ts-consent-section"
        >
          <h2>{{ section.heading }}</h2>
          <p>{{ section.body }}</p>
          <p v-if="section.linkHref" class="ts-consent-link">
            <a
              :href="section.linkHref"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ section.linkLabel ?? section.linkHref }}
            </a>
          </p>
        </section>
      </div>

      <footer class="ts-consent-actions">
        <button
          type="button"
          class="vd-btn vd-btn-ghost-primary"
          data-testid="ai-risk-decline"
          @click="emit('decline')"
        >
          Not now
        </button>
        <button
          ref="acceptRef"
          type="button"
          class="vd-btn vd-btn-primary"
          data-testid="ai-risk-accept"
          @click="emit('accept')"
        >
          I understand — open assistant
        </button>
      </footer>
    </div>
  </div>
</template>
