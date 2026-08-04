import { expect, test } from "@playwright/test";
import { THEME_STORAGE_KEY } from "./fixtures";

test.describe("theme persistence", () => {
  test("theme switch persists across reload", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /^Theme:/ }).click();
    await page.locator('[data-theme-value="dark"]').click();

    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.getAttribute("data-theme")),
      )
      .toBe("dark");

    await expect
      .poll(async () =>
        page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY),
      )
      .toBe("dark");

    await page.reload();

    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.getAttribute("data-theme")),
      )
      .toBe("dark");
  });
});
