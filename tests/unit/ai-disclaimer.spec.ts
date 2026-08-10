import { beforeEach, describe, expect, it } from "vitest";
import { AI_RISK_VERSION } from "@/content/ai-disclaimer";
import {
  acceptAiRisk,
  clearAiRiskAcceptance,
  hasAcceptedAiRisk,
  readAiRiskAcceptance,
} from "@/lib/ai-disclaimer";
import {
  resetAiRiskConsentState,
  useAiRiskConsent,
} from "@/composables/useAiRiskConsent";

describe("ai risk disclaimer storage", () => {
  beforeEach(() => {
    localStorage.clear();
    resetAiRiskConsentState();
  });

  it("rejects missing or wrong-version acceptance", () => {
    expect(hasAcceptedAiRisk()).toBe(false);
    acceptAiRisk("old");
    expect(hasAcceptedAiRisk()).toBe(false);
    expect(readAiRiskAcceptance()?.version).toBe("old");
  });

  it("accepts the current version", () => {
    acceptAiRisk(AI_RISK_VERSION);
    expect(hasAcceptedAiRisk()).toBe(true);
    clearAiRiskAcceptance();
    expect(hasAcceptedAiRisk()).toBe(false);
  });
});

describe("useAiRiskConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    resetAiRiskConsentState();
  });

  it("requestOpen shows the gate until accept", () => {
    const c = useAiRiskConsent();
    expect(c.requestOpen()).toBe(false);
    expect(c.showGate.value).toBe(true);

    c.decline();
    expect(c.showGate.value).toBe(false);
    expect(hasAcceptedAiRisk()).toBe(false);

    expect(c.requestOpen()).toBe(false);
    c.accept();
    expect(c.showGate.value).toBe(false);
    expect(c.requestOpen()).toBe(true);
  });
});
