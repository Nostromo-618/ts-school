import { expect, FIXTURE_LESSON, test } from "./fixtures";

test.describe("mobile responsive critical paths", () => {
  test("lesson uses tabs for dual-pane on narrow viewports", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "Chromium Mobile",
      "Mobile viewport project only",
    );
    await page.goto(FIXTURE_LESSON.path);
    await expect(page.getByRole("tab", { name: /JavaScript/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /TypeScript/i })).toBeVisible();
    await page.getByRole("tab", { name: /TypeScript/i }).click();
    await expect(
      page.getByLabel("TypeScript lesson editor"),
    ).toBeVisible();
  });

  test("AI chat opens as overlay on mobile", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "Chromium Mobile",
      "Mobile viewport project only",
    );
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
  });
});
