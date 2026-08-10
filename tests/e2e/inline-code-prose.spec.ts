import { expect, test } from "./fixtures";

test.describe("inline code prose", () => {
  test("backticked lesson insight renders a code element", async ({ page }) => {
    // Caption/insight already author `noEmit` / related backticks.
    await page.goto("/lessons/foundations/tsc-compiler-pipeline");

    const code = page.locator(".ts-prose code").filter({ hasText: "noEmit" });
    await expect(code.first()).toBeVisible();
    await expect(code.first()).toHaveCSS("font-family", /mono/i);
  });
});
