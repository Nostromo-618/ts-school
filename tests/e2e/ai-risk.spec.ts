import { expect, FIXTURE_LESSON, test } from "./fixtures";

test.describe("AI risk gate", () => {
  test.use({ skipAiRiskSeed: true });

  test("blocks chat until accept; decline closes", async ({ page }) => {
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ai-risk-gate")).toBeVisible();
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveCount(0);

    await page.getByTestId("ai-risk-decline").click();
    await expect(page.getByTestId("ai-risk-gate")).toHaveCount(0);
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveCount(0);

    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ai-risk-gate")).toBeVisible();
    await page.getByTestId("ai-risk-accept").click();
    await expect(page.getByTestId("ai-risk-gate")).toHaveCount(0);
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    // First successful open after accept auto-pins when preference is unset.
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveAttribute(
      "data-pinned",
      "true",
    );
  });

  test("stale AI risk version forces re-consent", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "ts-school-ai-risk-accepted",
        JSON.stringify({
          version: "0-stale",
          acceptedAt: new Date().toISOString(),
        }),
      );
    });
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ai-risk-gate")).toBeVisible();
  });
});
