import { expect, test } from "@playwright/test";
import { FIXTURE_LESSON, PROGRESS_STORAGE_KEY } from "./fixtures";

test.describe("progress persistence", () => {
  test("quiz progress survives reload via ts-school-progress", async ({
    page,
  }) => {
    await page.goto(FIXTURE_LESSON.path);

    await page
      .getByRole("button", {
        name: /argument's type is not assignable to the parameter/i,
      })
      .click();
    await expect(page.getByRole("status").filter({ hasText: /Correct/i })).toBeVisible();

    const before = await page.evaluate((key) => localStorage.getItem(key), PROGRESS_STORAGE_KEY);
    expect(before).toBeTruthy();
    const parsedBefore = JSON.parse(before!) as {
      version: number;
      lessons: Record<string, { quizScore?: { correct: number; total: number } }>;
    };
    expect(parsedBefore.version).toBe(1);
    expect(parsedBefore.lessons[FIXTURE_LESSON.id]?.quizScore).toEqual({
      correct: 1,
      total: 1,
    });

    await page.reload();

    const after = await page.evaluate((key) => localStorage.getItem(key), PROGRESS_STORAGE_KEY);
    expect(after).toBeTruthy();
    const parsedAfter = JSON.parse(after!) as typeof parsedBefore;
    expect(parsedAfter.lessons[FIXTURE_LESSON.id]?.quizScore).toEqual({
      correct: 1,
      total: 1,
    });
  });
});
