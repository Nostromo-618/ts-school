import { expect, FIXTURE_LESSON, test } from "./fixtures";

test.describe("lesson solution section", () => {
  test("shows The solution heading on an authored lesson", async ({ page }) => {
    await page.goto(FIXTURE_LESSON.path);
    await expect(
      page.getByRole("heading", { name: /solution/i }),
    ).toBeVisible();
  });
});
