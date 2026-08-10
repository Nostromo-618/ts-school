import { expect, EXERCISE_SOLUTION, FIXTURE_LESSON, test } from "./fixtures";

test.describe("quiz and exercise flows", () => {
  test("quiz feedback and exercise pass via solution-match", async ({
    page,
  }) => {
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

    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByText("Exercise passed.")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("exercise Check fails when code does not match the solution", async ({
    page,
  }) => {
    await page.goto(FIXTURE_LESSON.path);
    const exerciseEditor = page.getByLabel("Exercise editor");
    await exerciseEditor.fill("function nope() {}\n");
    await page.getByRole("button", { name: "Check" }).click();
    await expect(page.getByText(/Not a match yet/i)).toBeVisible({
      timeout: 10_000,
    });
  });
});
