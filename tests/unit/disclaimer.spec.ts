import { beforeEach, describe, expect, it } from "vitest";
import {
  DISCLAIMER_SECTIONS,
  TOC_STORAGE_KEY,
  TOC_VERSION,
} from "@/content/disclaimer";
import {
  acceptDisclaimer,
  clearDisclaimerAcceptance,
  declineDisclaimer,
  hasAcceptedDisclaimer,
  hasDeclinedDisclaimer,
  readDisclaimerAcceptance,
} from "@/lib/disclaimer";
import {
  resetDisclaimerConsentState,
  useDisclaimerConsent,
} from "@/composables/useDisclaimerConsent";
import { buildRoutes } from "@/router";

describe("disclaimer copy", () => {
  it("bumps TOC_VERSION and folds Ask risks into site terms", () => {
    expect(TOC_VERSION).toBe("3");
    const blob = DISCLAIMER_SECTIONS.map((s) => `${s.heading}\n${s.body}`).join(
      "\n",
    );
    expect(blob).toMatch(/local model|RAM|WebGPU/i);
    expect(blob).toMatch(/hallucin|invent|wrong/i);
    expect(blob).toMatch(/Accept or Reject/i);
    expect(blob).toMatch(/Article 50|AI Act/i);
    expect(blob).toMatch(/Hugging Face|localStorage/i);
    expect(blob).not.toMatch(/additional AI risk acceptance/i);
  });
});

describe("disclaimer acceptance", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetDisclaimerConsentState();
  });

  it("starts unaccepted", () => {
    expect(hasAcceptedDisclaimer()).toBe(false);
    expect(readDisclaimerAcceptance()).toBeNull();
  });

  it("accept persists versioned payload under ts-school-toc-accepted", () => {
    const payload = acceptDisclaimer();
    expect(payload.version).toBe(TOC_VERSION);
    expect(payload.acceptedAt).toMatch(/^\d{4}-/);
    expect(hasAcceptedDisclaimer()).toBe(true);
    const raw = localStorage.getItem(TOC_STORAGE_KEY);
    expect(raw).toContain(`"version":"${TOC_VERSION}"`);
  });

  it("decline does not write acceptance", () => {
    declineDisclaimer();
    expect(localStorage.getItem(TOC_STORAGE_KEY)).toBeNull();
    expect(hasAcceptedDisclaimer()).toBe(false);
    expect(hasDeclinedDisclaimer()).toBe(true);
  });

  it("mismatched version is treated as not accepted", () => {
    localStorage.setItem(
      TOC_STORAGE_KEY,
      JSON.stringify({
        version: "0-legacy",
        acceptedAt: "2020-01-01T00:00:00.000Z",
      }),
    );
    expect(hasAcceptedDisclaimer(TOC_VERSION)).toBe(false);
  });

  it("clearDisclaimerAcceptance removes consent", () => {
    acceptDisclaimer();
    clearDisclaimerAcceptance();
    expect(hasAcceptedDisclaimer()).toBe(false);
  });

  it("composable stays ungated until refresh (SSG-safe)", () => {
    const consent = useDisclaimerConsent();
    expect(consent.hydrated.value).toBe(false);
    expect(consent.showGate.value).toBe(false);
    consent.refresh();
    expect(consent.hydrated.value).toBe(true);
    expect(consent.showGate.value).toBe(true);
  });

  it("composable accept/decline views", () => {
    const consent = useDisclaimerConsent();
    consent.refresh();
    expect(consent.showGate.value).toBe(true);
    consent.decline();
    expect(consent.showFarewell.value).toBe(true);
    expect(hasAcceptedDisclaimer()).toBe(false);
    consent.reopenGate();
    expect(consent.showGate.value).toBe(true);
    consent.accept();
    expect(consent.accepted.value).toBe(true);
    expect(consent.showGate.value).toBe(false);
  });

  it("reopenGate does not revoke an existing acceptance", () => {
    const consent = useDisclaimerConsent();
    consent.refresh();
    consent.accept();
    consent.reopenGate();
    expect(consent.accepted.value).toBe(true);
    expect(consent.showGate.value).toBe(false);
  });
});

describe("terms and farewell routes", () => {
  it("registers /terms and /farewell ahead of the catch-all", () => {
    const routes = buildRoutes();
    const terms = routes.find((route) => route.path === "/terms");
    const farewell = routes.find((route) => route.path === "/farewell");
    const catchAll = routes[routes.length - 1];

    expect(terms?.name).toBe("terms");
    expect(farewell?.name).toBe("farewell");
    expect(catchAll.name).toBe("not-found");
  });
});
