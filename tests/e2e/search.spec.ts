import { expect, test } from "@playwright/test";
import { FIXTURE_LESSON } from "./fixtures";

test.describe("global search", () => {
  test("cmd/ctrl+K opens search and navigates to a lesson", async ({
    page,
  }) => {
    await page.goto("/");
    // Wait for client listeners (cmd+K) to attach after hydration.
    await expect(
      page.getByRole("button", { name: "Search the curriculum" }),
    ).toBeVisible();

    await page.keyboard.press("Meta+K");

    const searchInput = page.getByRole("searchbox", {
      name: "Search the curriculum",
    });
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill(FIXTURE_LESSON.titleFragment);

    const result = page.getByRole("option").filter({
      hasText: /first type error/i,
    });
    await expect(result.first()).toBeVisible({ timeout: 10_000 });
    await result.first().click();

    await expect(page).toHaveURL(new RegExp(`${FIXTURE_LESSON.path}$`));
    await expect(
      page.getByRole("heading", { name: /Your first type error/i }),
    ).toBeVisible();
  });
});
