import { expect, FIXTURE_LESSON, test } from "./fixtures";

const routes = [
  { name: "home", path: "/", fullPage: true },
  // Curriculum is ~18kpx full-page; height jitters a few rows while fonts settle,
  // so capture the viewport (still covers catalog chrome + first tracks).
  { name: "curriculum", path: "/curriculum", fullPage: false },
  { name: "lesson-first-type-error", path: FIXTURE_LESSON.path, fullPage: true },
  { name: "history", path: "/history", fullPage: true },
  { name: "profile", path: "/profile", fullPage: true },
] as const;

test.describe("visual baselines", () => {
  for (const route of routes) {
    test(`${route.name} matches Chromium Desktop baseline`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      // Allow client hydration / theme init to settle.
      await page.waitForTimeout(400);

      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: route.fullPage,
        animations: "disabled",
      });
    });
  }
});
