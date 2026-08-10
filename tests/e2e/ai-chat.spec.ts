import { expect, FIXTURE_LESSON, test } from "./fixtures";

test.describe("lesson AI chat sidebar", () => {
  test("opens from the navbar ask control and auto-pins on first open", async ({
    page,
  }) => {
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveAttribute(
      "data-pinned",
      "true",
    );
    await expect(page.locator(".ts-app-shell")).toHaveClass(/is-ai-chat-pinned/);
    await expect(page.getByTestId("ts-ai-load")).toBeVisible();
    await expect(page.getByTestId("ts-ai-input")).toBeDisabled();
  });

  test("pin keeps the pane open across navigation and reload", async ({
    page,
  }) => {
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    // First open auto-pins; no manual pin click needed.
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveAttribute(
      "data-pinned",
      "true",
    );

    await page.goto("/curriculum");
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    await expect(page.locator(".ts-app-shell")).toHaveClass(/is-ai-chat-pinned/);

    await page.reload();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveAttribute(
      "data-pinned",
      "true",
    );
  });

  test("respects explicit unpin on later opens", async ({ page }) => {
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveAttribute(
      "data-pinned",
      "true",
    );

    await page.getByTestId("ts-ai-pin").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveAttribute(
      "data-pinned",
      "false",
    );

    await page.getByTestId("ts-ai-close").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveCount(0);

    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    await expect(page.getByTestId("ts-ai-sidebar")).toHaveAttribute(
      "data-pinned",
      "false",
    );
    await expect(page.locator(".ts-app-shell")).not.toHaveClass(
      /is-ai-chat-pinned/,
    );
  });
});
