/** Picker labels / capacity hint — E2B stays default; E4B is recommended on capable hardware. */

export const SCHOOL_DEFAULT_MODEL_ID = "gemma-4-E2B-it-web";
export const SCHOOL_QUALITY_MODEL_ID = "gemma-4-E4B-it-web";

/** Persist last Ask model selection across refresh. */
export const SCHOOL_AI_MODEL_ID_KEY = "ts-school-ai-model-id";

export function schoolModelOptionLabel(id: string): string {
  if (id === SCHOOL_QUALITY_MODEL_ID) {
    return "Gemma 4 E4B (~2.5GB) — Quality (recommended if ≥8GB RAM)";
  }
  if (id === SCHOOL_DEFAULT_MODEL_ID) {
    return "Gemma 4 E2B (~2.0GB) — Fast (default)";
  }
  return id;
}

/** Allowed Gemma web model ids for the school picker. */
export function isSchoolGemmaModelId(id: string): boolean {
  return id === SCHOOL_DEFAULT_MODEL_ID || id === SCHOOL_QUALITY_MODEL_ID;
}

/** Read last selected model id from localStorage (falls back to default). */
export function readPersistedSchoolModelId(): string {
  if (typeof localStorage === "undefined") return SCHOOL_DEFAULT_MODEL_ID;
  try {
    const raw = localStorage.getItem(SCHOOL_AI_MODEL_ID_KEY);
    if (raw && isSchoolGemmaModelId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return SCHOOL_DEFAULT_MODEL_ID;
}

/** Persist picker selection. */
export function persistSchoolModelId(id: string): void {
  if (typeof localStorage === "undefined") return;
  if (!isSchoolGemmaModelId(id)) return;
  try {
    localStorage.setItem(SCHOOL_AI_MODEL_ID_KEY, id);
  } catch {
    /* ignore */
  }
}

/**
 * Soft recommendation under the model select.
 * `deviceMemoryGb` is `navigator.deviceMemory` (often capped at 8).
 */
export function schoolModelRecommendHint(
  deviceMemoryGb: number | null | undefined,
): string {
  if (deviceMemoryGb != null && deviceMemoryGb <= 4) {
    return "This browser reports limited RAM — keep the Fast (E2B) default to reduce freeze/OOM risk.";
  }
  if (deviceMemoryGb != null && deviceMemoryGb >= 8) {
    return "Capable machine detected: E2B stays the default for a faster first load; switch to E4B for richer answers (+~0.5GB).";
  }
  return "E2B is the default (faster load). Prefer E4B Quality on machines with ~8GB+ RAM if you want stronger tutoring.";
}
