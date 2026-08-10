import { computed, ref } from "vue";
import { TOC_VERSION } from "@/content/disclaimer";
import {
  acceptDisclaimer,
  clearDeclinedDisclaimer,
  clearDisclaimerAcceptance,
  declineDisclaimer,
  hasAcceptedDisclaimer,
  hasDeclinedDisclaimer,
  readDisclaimerAcceptance,
} from "@/lib/disclaimer";

export type ConsentView = "gate" | "farewell" | "accepted";

const view = ref<ConsentView>("gate");
/** Remains false until a client `refresh()` / `onMounted` — keeps SSG free of storage reads. */
const hydrated = ref(false);

function syncFromStorage(): void {
  if (typeof localStorage === "undefined") {
    view.value = "gate";
    hydrated.value = true;
    return;
  }
  if (hasAcceptedDisclaimer(TOC_VERSION)) {
    view.value = "accepted";
  } else if (hasDeclinedDisclaimer(TOC_VERSION)) {
    view.value = "farewell";
  } else {
    view.value = "gate";
  }
  hydrated.value = true;
}

/** Test helper — resets module singleton between Vitest cases. */
export function resetDisclaimerConsentState(): void {
  view.value = "gate";
  hydrated.value = false;
  clearDeclinedDisclaimer();
}

export function useDisclaimerConsent() {
  const accepted = computed(() => view.value === "accepted");
  const showGate = computed(() => hydrated.value && view.value === "gate");
  const showFarewell = computed(
    () => hydrated.value && view.value === "farewell",
  );

  function accept(): void {
    acceptDisclaimer(TOC_VERSION);
    view.value = "accepted";
  }

  function decline(): void {
    declineDisclaimer();
    view.value = "farewell";
  }

  function reopenGate(): void {
    clearDeclinedDisclaimer();
    view.value = hasAcceptedDisclaimer(TOC_VERSION) ? "accepted" : "gate";
  }

  function resetAcceptance(): void {
    clearDisclaimerAcceptance();
    clearDeclinedDisclaimer();
    view.value = "gate";
  }

  function refresh(): void {
    syncFromStorage();
  }

  return {
    view,
    hydrated,
    accepted,
    showGate,
    showFarewell,
    version: TOC_VERSION,
    acceptance: computed(() => readDisclaimerAcceptance()),
    accept,
    decline,
    reopenGate,
    resetAcceptance,
    refresh,
  };
}
