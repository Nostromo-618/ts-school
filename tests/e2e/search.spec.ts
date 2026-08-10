import { expect, FIXTURE_LESSON, test } from "./fixtures";

const searchDialog = (page: import("@playwright/test").Page) =>
  page.getByRole("dialog", { name: "Search the curriculum" });

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
    await expect(searchDialog(page)).toBeHidden();
    await expect(
      page.getByRole("heading", { name: /Your first type error/i }),
    ).toBeVisible();
  });

  test("Enter on a result navigates and closes the palette", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Search the curriculum" }),
    ).toBeVisible();

    // Open via the navbar control so focus-restore would otherwise reopen
    // the palette if Enter is not prevented during close.
    await page.getByRole("button", { name: "Search the curriculum" }).click();

    const searchInput = page.getByRole("searchbox", {
      name: "Search the curriculum",
    });
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill(FIXTURE_LESSON.titleFragment);

    const result = page.getByRole("option").filter({
      hasText: /first type error/i,
    });
    await expect(result.first()).toBeVisible({ timeout: 10_000 });
    await searchInput.press("Enter");

    await expect(page).toHaveURL(new RegExp(`${FIXTURE_LESSON.path}$`));
    await expect(searchDialog(page)).toBeHidden();
    await expect(
      page.getByRole("heading", { name: /Your first type error/i }),
    ).toBeVisible();
  });
});
