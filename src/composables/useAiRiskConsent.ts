import { computed, ref } from "vue";
import { AI_RISK_VERSION } from "@/content/ai-disclaimer";
import {
  acceptAiRisk,
  clearAiRiskAcceptance,
  hasAcceptedAiRisk,
  readAiRiskAcceptance,
} from "@/lib/ai-disclaimer";

/** Remains false until a client `refresh()` — SSG-safe. */
const hydrated = ref(false);
const accepted = ref(false);
/** True while the mandatory AI risk modal should block chat open. */
const showGate = ref(false);

function syncFromStorage(): void {
  if (typeof localStorage === "undefined") {
    accepted.value = false;
    hydrated.value = true;
    return;
  }
  accepted.value = hasAcceptedAiRisk(AI_RISK_VERSION);
  hydrated.value = true;
}

/** Test helper — resets module singleton between Vitest cases. */
export function resetAiRiskConsentState(): void {
  hydrated.value = false;
  accepted.value = false;
  showGate.value = false;
  clearAiRiskAcceptance();
}

export function useAiRiskConsent() {
  function refresh(): void {
    syncFromStorage();
  }

  function requestOpen(): boolean {
    refresh();
    if (accepted.value) {
      showGate.value = false;
      return true;
    }
    showGate.value = true;
    return false;
  }

  function accept(): void {
    acceptAiRisk(AI_RISK_VERSION);
    accepted.value = true;
    showGate.value = false;
  }

  function decline(): void {
    showGate.value = false;
  }

  function resetAcceptance(): void {
    clearAiRiskAcceptance();
    accepted.value = false;
    showGate.value = false;
  }

  return {
    hydrated,
    accepted: computed(() => accepted.value),
    showGate: computed(() => showGate.value),
    version: AI_RISK_VERSION,
    acceptance: computed(() => readAiRiskAcceptance()),
    refresh,
    requestOpen,
    accept,
    decline,
    resetAcceptance,
  };
}
