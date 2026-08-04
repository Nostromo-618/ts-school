/** Shared fixture constants for Chromium Desktop e2e. */
export const FIXTURE_LESSON = {
  id: "first-type-error",
  path: "/lessons/foundations/first-type-error",
  titleFragment: "first type error",
} as const;

export const PROGRESS_STORAGE_KEY = "ts-school-progress";
export const THEME_STORAGE_KEY = "vanduo-theme-preference";

/** Known-bad snippet that yields a live TS2322 (distinct from the lesson's TS2345). */
export const LIVE_DIAGNOSTIC_SNIPPET = `const n: number = "broken";
`;

export const EXERCISE_SOLUTION = `function addTax(amount: number): number {
  return amount * 1.2;
}

addTax(Number("19.99"));
`;
