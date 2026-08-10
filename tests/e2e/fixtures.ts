/** Shared fixture constants for Chromium Desktop e2e. */
import { test as base } from "@playwright/test";
import {
  TOC_STORAGE_KEY,
  TOC_VERSION,
} from "../../src/content/disclaimer";
import { AI_RISK_STORAGE_KEY } from "../../src/content/ai-disclaimer";

export const FIXTURE_LESSON = {
  id: "first-type-error",
  path: "/lessons/foundations/first-type-error",
  titleFragment: "first type error",
} as const;

export const PROGRESS_STORAGE_KEY = "ts-school-progress";
export const THEME_STORAGE_KEY = "ts-school-theme-preference";
export { TOC_STORAGE_KEY, TOC_VERSION, AI_RISK_STORAGE_KEY };

export const EXERCISE_SOLUTION = `function addTax(amount: number): number {
  return amount * 1.2;
}

addTax(Number("19.99"));
`;

type TocFixtures = {
  /** When true, do not pre-seed ToC acceptance (disclaimer gate specs). */
  skipTocSeed: boolean;
};

/**
 * Default e2e pages seed versioned ToC acceptance so existing suites are not
 * blocked. Disclaimer specs opt out via `skipTocSeed`.
 */
export const test = base.extend<TocFixtures>({
  skipTocSeed: [false, { option: true }],
  page: async ({ page, skipTocSeed }, use) => {
    await page.addInitScript(
      ({ tocKey, tocVersion, seedToc }) => {
        if (seedToc) {
          localStorage.setItem(
            tocKey,
            JSON.stringify({
              version: tocVersion,
              acceptedAt: new Date().toISOString(),
            }),
          );
          sessionStorage.removeItem("ts-school-toc-declined");
        }
      },
      {
        tocKey: TOC_STORAGE_KEY,
        tocVersion: TOC_VERSION,
        seedToc: !skipTocSeed,
      },
    );
    await use(page);
  },
});

export { expect } from "@playwright/test";

/** Clear ToC storage once per tab before a disclaimer-focused visit. */
export async function clearTocStorage(
  page: import("@playwright/test").Page,
): Promise<void> {
  await page.addInitScript(
    ({ tocKey }) => {
      const marker = "ts-school-e2e-toc-ready";
      if (sessionStorage.getItem(marker)) return;
      sessionStorage.setItem(marker, "1");
      try {
        localStorage.removeItem(tocKey);
        sessionStorage.removeItem("ts-school-toc-declined");
      } catch {
        /* ignore */
      }
    },
    { tocKey: TOC_STORAGE_KEY },
  );
}
