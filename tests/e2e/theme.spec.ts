import { expect, test, THEME_STORAGE_KEY } from "./fixtures";

test.describe("theme persistence", () => {
  test("theme switch persists across reload", async ({ page }) => {
    await page.goto("/");

    const themeButton = page.getByRole("button", { name: /^Theme:/ });

    // Click-to-cycle until preference is dark (system → light → dark).
    for (let i = 0; i < 3; i++) {
      const pref = await page.evaluate(
        (key) => localStorage.getItem(key),
        THEME_STORAGE_KEY,
      );
      if (pref === "dark") break;
      await themeButton.click();
    }

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

    await expect
      .poll(async () =>
        page.evaluate(() => {
          const leftovers: string[] = [];
          for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (key?.startsWith("vanduo-")) leftovers.push(key);
          }
          return leftovers;
        }),
      )
      .toEqual([]);

    await page.reload();

    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.getAttribute("data-theme")),
      )
      .toBe("dark");
  });
});
