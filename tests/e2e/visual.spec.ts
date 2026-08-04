import { expect, test } from "@playwright/test";
import { FIXTURE_LESSON } from "./fixtures";

const routes = [
  { name: "home", path: "/" },
  { name: "curriculum", path: "/curriculum" },
  { name: "lesson-first-type-error", path: FIXTURE_LESSON.path },
  { name: "history", path: "/history" },
] as const;

test.describe("visual baselines", () => {
  for (const route of routes) {
    test(`${route.name} matches Chromium Desktop baseline`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      // Allow client hydration / theme init to settle.
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
        animations: "disabled",
      });
    });
  }
});
