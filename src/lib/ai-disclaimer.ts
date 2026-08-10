import { AI_RISK_STORAGE_KEY, AI_RISK_VERSION } from "@/content/ai-disclaimer";

export interface AiRiskAcceptance {
  version: string;
  acceptedAt: string;
}

function canUseStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function readAiRiskAcceptance(): AiRiskAcceptance | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(AI_RISK_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as Partial<AiRiskAcceptance>;
    if (typeof rec.version !== "string" || typeof rec.acceptedAt !== "string") {
      return null;
    }
    return { version: rec.version, acceptedAt: rec.acceptedAt };
  } catch {
    return null;
  }
}

/** True only when stored acceptance matches the current AI_RISK_VERSION. */
export function hasAcceptedAiRisk(version: string = AI_RISK_VERSION): boolean {
  const current = readAiRiskAcceptance();
  return current?.version === version;
}

export function acceptAiRisk(
  version: string = AI_RISK_VERSION,
  at: Date = new Date(),
): AiRiskAcceptance {
  const payload: AiRiskAcceptance = {
    version,
    acceptedAt: at.toISOString(),
  };
  if (canUseStorage()) {
    localStorage.setItem(AI_RISK_STORAGE_KEY, JSON.stringify(payload));
  }
  return payload;
}

export function clearAiRiskAcceptance(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(AI_RISK_STORAGE_KEY);
}
