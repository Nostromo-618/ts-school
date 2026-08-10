/** Picker labels / capacity hint — E2B stays default; E4B is recommended on capable hardware. */

export const SCHOOL_DEFAULT_MODEL_ID = "gemma-4-E2B-it-web";
export const SCHOOL_QUALITY_MODEL_ID = "gemma-4-E4B-it-web";

export function schoolModelOptionLabel(id: string): string {
  if (id === SCHOOL_QUALITY_MODEL_ID) {
    return "Gemma 4 E4B (~2.5GB) — Quality (recommended if ≥8GB RAM)";
  }
  if (id === SCHOOL_DEFAULT_MODEL_ID) {
    return "Gemma 4 E2B (~2.0GB) — Fast (default)";
  }
  return id;
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
