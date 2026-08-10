<script setup lang="ts">
import { useRouter } from "vue-router";
import { FAREWELL_BODY, FAREWELL_TITLE } from "@/content/disclaimer";
import { useDisclaimerConsent } from "@/composables/useDisclaimerConsent";

const router = useRouter();
const { reopenGate } = useDisclaimerConsent();

function onReread(): void {
  reopenGate();
  void router.replace("/");
}
</script>

<template>
  <div class="ts-farewell-page" data-testid="disclaimer-farewell">
    <div class="ts-farewell-inner">
      <i class="ph ph-hand-waving ts-farewell-icon" aria-hidden="true"></i>
      <h1 id="farewell-title">{{ FAREWELL_TITLE }}</h1>
      <p>{{ FAREWELL_BODY }}</p>
      <div class="ts-farewell-actions">
        <button
          type="button"
          class="vd-btn vd-btn-primary"
          data-testid="disclaimer-reread"
          @click="onReread"
        >
          Re-read the disclaimer
        </button>
      </div>
    </div>
  </div>
</template>
