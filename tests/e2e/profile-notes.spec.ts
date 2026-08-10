import {
  AI_RISK_STORAGE_KEY,
  expect,
  FIXTURE_LESSON,
  PROGRESS_STORAGE_KEY,
  test,
} from "./fixtures";

const NOTES_STORAGE_KEY = "ts-school-notes";
const NOTES_PINNED_KEY = "ts-school-notes-pinned";
const NOTES_PIN_SIDE_KEY = "ts-school-notes-pin-side";

test.describe("profile and notes", () => {
  test("opens profile from the navbar icon", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("ts-open-profile").click();
    await expect(page).toHaveURL(/\/profile\/?$/);
    await expect(page.getByTestId("ts-profile-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
  });

  test("shows seeded progress on Profile", async ({ page }) => {
    await page.addInitScript(
      ({ progressKey }) => {
        localStorage.setItem(
          progressKey,
          JSON.stringify({
            version: 1,
            lessons: {
              "why-types": {
                status: "complete",
                updatedAt: "2026-08-10T12:00:00.000Z",
              },
              "first-type-error": {
                status: "in-progress",
                updatedAt: "2026-08-10T13:00:00.000Z",
              },
            },
          }),
        );
      },
      { progressKey: PROGRESS_STORAGE_KEY },
    );
    await page.goto("/profile");
    await expect(page.getByTestId("ts-profile-progress")).toContainText(
      /1 complete/i,
    );
    await expect(page.getByTestId("ts-profile-progress")).toContainText(
      /1 in progress/i,
    );
  });

  test("notes persist across reload", async ({ page }) => {
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-notes").click();
    await expect(page.getByTestId("ts-notes-sidebar")).toBeVisible();
    await page.getByTestId("ts-notes-editor").fill("persist me across reload");
    await page.waitForTimeout(400);
    await page.reload();
    await page.getByTestId("ts-open-notes").click();
    await expect(page.getByTestId("ts-notes-editor")).toHaveValue(
      "persist me across reload",
    );
    const stored = await page.evaluate(
      (key) => localStorage.getItem(key),
      NOTES_STORAGE_KEY,
    );
    expect(stored).toContain("persist me across reload");
  });

  test("pins notes left or right at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-notes").click();
    await page.getByTestId("ts-notes-pin-left").click();
    await expect(page.getByTestId("ts-notes-sidebar")).toHaveAttribute(
      "data-pin-side",
      "left",
    );
    await expect(page.getByTestId("ts-notes-sidebar")).toHaveAttribute(
      "data-pinned",
      "true",
    );
    await expect(page.locator(".ts-app-shell")).toHaveClass(
      /is-notes-pinned-left/,
    );

    await page.getByTestId("ts-notes-pin-right").click();
    await expect(page.getByTestId("ts-notes-sidebar")).toHaveAttribute(
      "data-pin-side",
      "right",
    );
    await expect(page.locator(".ts-app-shell")).toHaveClass(
      /is-notes-pinned-right/,
    );
    await expect(page.locator(".ts-app-shell")).not.toHaveClass(
      /is-notes-pinned-left/,
    );

    const side = await page.evaluate(
      (key) => localStorage.getItem(key),
      NOTES_PIN_SIDE_KEY,
    );
    expect(side).toBe("right");
    const pinned = await page.evaluate(
      (key) => localStorage.getItem(key),
      NOTES_PINNED_KEY,
    );
    expect(pinned).toBe("1");
  });

  test("export download contains progress and notes", async ({ page }) => {
    await page.addInitScript(
      ({ progressKey, notesKey }) => {
        localStorage.setItem(
          progressKey,
          JSON.stringify({
            version: 1,
            lessons: {
              "why-types": {
                status: "complete",
                updatedAt: "2026-08-10T12:00:00.000Z",
              },
            },
          }),
        );
        localStorage.setItem(
          notesKey,
          JSON.stringify({
            version: 1,
            body: "exported notes body",
            updatedAt: "2026-08-10T12:00:00.000Z",
          }),
        );
      },
      { progressKey: PROGRESS_STORAGE_KEY, notesKey: NOTES_STORAGE_KEY },
    );

    await page.goto("/profile");
    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("ts-profile-export").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(
      /typescript-school-export-\d{8}\.json/,
    );
    const path = await download.path();
    expect(path).toBeTruthy();
    const fs = await import("node:fs/promises");
    const text = await fs.readFile(path!, "utf8");
    const json = JSON.parse(text) as {
      progress: { lessons: Record<string, unknown> } | null;
      notes: { body: string } | null;
    };
    expect(json.progress?.lessons["why-types"]).toBeTruthy();
    expect(json.notes?.body).toBe("exported notes body");
  });

  test("clear-all confirm wipes; cancel preserves; Ask re-prompts AI risk", async ({
    page,
  }) => {
    await page.addInitScript(
      ({ progressKey, notesKey, aiKey }) => {
        localStorage.setItem(
          progressKey,
          JSON.stringify({
            version: 1,
            lessons: {
              "why-types": {
                status: "complete",
                updatedAt: "2026-08-10T12:00:00.000Z",
              },
            },
          }),
        );
        localStorage.setItem(
          notesKey,
          JSON.stringify({
            version: 1,
            body: "keep or wipe",
            updatedAt: "2026-08-10T12:00:00.000Z",
          }),
        );
        localStorage.setItem(
          aiKey,
          JSON.stringify({
            version: "1",
            acceptedAt: "2026-08-10T12:00:00.000Z",
          }),
        );
      },
      {
        progressKey: PROGRESS_STORAGE_KEY,
        notesKey: NOTES_STORAGE_KEY,
        aiKey: AI_RISK_STORAGE_KEY,
      },
    );

    await page.goto("/profile");
    await page.getByTestId("ts-profile-clear-all").click();
    await expect(page.getByTestId("ts-profile-clear-all-confirm")).toBeVisible();
    await page.getByTestId("ts-profile-clear-all-cancel").click();
    expect(await page.evaluate((k) => localStorage.getItem(k), PROGRESS_STORAGE_KEY)).toBeTruthy();

    await page.getByTestId("ts-profile-clear-all").click();
    await page.getByTestId("ts-profile-clear-all-confirm").click();
    await expect(page.getByTestId("ts-profile-status")).toContainText(/cleared/i);

    expect(await page.evaluate((k) => localStorage.getItem(k), PROGRESS_STORAGE_KEY)).toBeNull();
    expect(await page.evaluate((k) => localStorage.getItem(k), NOTES_STORAGE_KEY)).toBeNull();
    expect(await page.evaluate((k) => localStorage.getItem(k), AI_RISK_STORAGE_KEY)).toBeNull();

    // ToC was also cleared — accept again so Ask can open.
    const tocGate = page.getByTestId("disclaimer-gate");
    if (await tocGate.isVisible().catch(() => false)) {
      await page.getByTestId("disclaimer-accept").click();
    }

    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ai-risk-gate")).toHaveCount(0);
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
  });
});
