import { TOC_STORAGE_KEY, TOC_VERSION } from "@/content/disclaimer";

export interface DisclaimerAcceptance {
  version: string;
  acceptedAt: string;
}

const DECLINED_SESSION_KEY = "ts-school-toc-declined";

function canUseStorage(): boolean {
  return typeof localStorage !== "undefined";
}

function canUseSession(): boolean {
  return typeof sessionStorage !== "undefined";
}

export function readDisclaimerAcceptance(): DisclaimerAcceptance | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(TOC_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as Partial<DisclaimerAcceptance>;
    if (typeof rec.version !== "string" || typeof rec.acceptedAt !== "string") {
      return null;
    }
    return { version: rec.version, acceptedAt: rec.acceptedAt };
  } catch {
    return null;
  }
}

/** True only when stored acceptance matches the current TOC_VERSION. */
export function hasAcceptedDisclaimer(version: string = TOC_VERSION): boolean {
  const current = readDisclaimerAcceptance();
  return current?.version === version;
}

export function acceptDisclaimer(
  version: string = TOC_VERSION,
  at: Date = new Date(),
): DisclaimerAcceptance {
  const payload: DisclaimerAcceptance = {
    version,
    acceptedAt: at.toISOString(),
  };
  if (canUseStorage()) {
    localStorage.setItem(TOC_STORAGE_KEY, JSON.stringify(payload));
  }
  if (canUseSession()) {
    sessionStorage.removeItem(DECLINED_SESSION_KEY);
  }
  return payload;
}

/** Decline must not write acceptance; session flag keeps farewell across navigations. */
export function declineDisclaimer(): void {
  if (canUseSession()) {
    sessionStorage.setItem(DECLINED_SESSION_KEY, TOC_VERSION);
  }
}

export function hasDeclinedDisclaimer(version: string = TOC_VERSION): boolean {
  if (!canUseSession()) return false;
  return sessionStorage.getItem(DECLINED_SESSION_KEY) === version;
}

export function clearDeclinedDisclaimer(): void {
  if (!canUseSession()) return;
  sessionStorage.removeItem(DECLINED_SESSION_KEY);
}

export function clearDisclaimerAcceptance(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(TOC_STORAGE_KEY);
}
