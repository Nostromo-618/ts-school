import { clearTocStorage, expect, test } from "./fixtures";

test.describe("disclaimer gate", () => {
  test.use({ skipTocSeed: true });

  test("decline opens farewell and blocks curriculum", async ({ page }) => {
    await clearTocStorage(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("disclaimer-gate")).toBeVisible();
    await page.getByTestId("disclaimer-decline").click();
    await expect(page).toHaveURL(/\/farewell\/?$/);
    await expect(page.getByTestId("disclaimer-farewell")).toBeVisible();

    await page.goto("/curriculum", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/farewell\/?$/);
    await expect(page.getByTestId("disclaimer-farewell")).toBeVisible();
  });

  test("accept unlocks the site", async ({ page }) => {
    await clearTocStorage(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("disclaimer-accept").click();
    await expect(page.getByTestId("disclaimer-gate")).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        name: /Learn TypeScript by fixing JavaScript/i,
      }),
    ).toBeVisible();
  });

  test("farewell can reopen the gate", async ({ page }) => {
    await clearTocStorage(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByTestId("disclaimer-decline").click();
    await expect(page).toHaveURL(/\/farewell\/?$/);
    await page.getByTestId("disclaimer-reread").click();
    await expect(page.getByTestId("disclaimer-gate")).toBeVisible();
    await expect(page).not.toHaveURL(/\/farewell\/?$/);
  });

  test("stale TOC version forces re-consent", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "ts-school-toc-accepted",
        JSON.stringify({
          version: "0-stale",
          acceptedAt: new Date().toISOString(),
        }),
      );
      sessionStorage.removeItem("ts-school-toc-declined");
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("disclaimer-gate")).toBeVisible();
  });
});
