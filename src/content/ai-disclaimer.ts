/**
 * Legacy AI risk acceptance key from when Ask had a separate modal.
 *
 * New consent is the site ToC only (`TOC_STORAGE_KEY` / `TOC_VERSION`).
 * Profile clear-all and the data inventory still clear / list this key when
 * present so returning browsers do not keep stale acceptance.
 */

/** localStorage key formerly used for versioned AI risk acceptance JSON. */
export const AI_RISK_STORAGE_KEY = "ts-school-ai-risk-accepted";
