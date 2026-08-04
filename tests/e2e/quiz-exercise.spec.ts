import { expect, test } from "@playwright/test";
import { EXERCISE_SOLUTION, FIXTURE_LESSON } from "./fixtures";

test.describe("quiz and exercise flows", () => {
  test("quiz feedback and exercise pass", async ({ page }) => {
    await page.goto(FIXTURE_LESSON.path);

    await expect(page.getByRole("heading", { name: "Quiz" })).toBeVisible();

    await page
      .getByRole("button", {
        name: /argument's type is not assignable to the parameter/i,
      })
      .click();

    await expect(
      page.getByRole("status").filter({ hasText: /Correct/i }),
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "Exercise" })).toBeVisible();
    const exerciseEditor = page.getByLabel("Exercise editor");
    await exerciseEditor.fill(EXERCISE_SOLUTION);

    await expect(
      page
        .locator(".ts-exercise")
        .getByRole("region", { name: "TypeScript diagnostics" })
        .getByText("No diagnostics."),
    ).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByText("Exercise passed.")).toBeVisible({
      timeout: 10_000,
    });
  });
});
