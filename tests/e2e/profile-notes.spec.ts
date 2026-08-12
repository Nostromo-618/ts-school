import {
  AI_RISK_STORAGE_KEY,
  expect,
  FIXTURE_LESSON,
  PROGRESS_STORAGE_KEY,
  test,
} from "./fixtures";

const NOTES_STORAGE_KEY = "ts-school-notes";
const NOTES_WINDOW_KEY = "ts-school-notes-window";
const NOTES_FOLDED_KEY = "ts-school-notes-folded";
const CHAT_HISTORY_KEY = "ts-school-ai-chat-history";

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

  test("notes open/close and body persist across reload", async ({ page }) => {
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-notes").click();
    await expect(page.getByTestId("ts-notes-modal")).toBeVisible();
    await page.getByTestId("ts-notes-editor").fill("persist me across reload");
    await page.waitForTimeout(400);
    await page.getByTestId("ts-notes-close").click();
    await expect(page.getByTestId("ts-notes-modal")).toBeHidden();
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

  test("notes drag, resize, and fold persist at desktop width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-notes").click();
    const modal = page.getByTestId("ts-notes-modal");
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("data-sheet", "false");

    const before = await modal.boundingBox();
    expect(before).toBeTruthy();

    const drag = page.getByTestId("ts-notes-drag-handle");
    const dragBox = await drag.boundingBox();
    expect(dragBox).toBeTruthy();
    await page.mouse.move(
      dragBox!.x + dragBox!.width / 2,
      dragBox!.y + dragBox!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      dragBox!.x + dragBox!.width / 2 - 140,
      dragBox!.y + dragBox!.height / 2 - 60,
      { steps: 12 },
    );
    await page.mouse.up();

    const afterDrag = await modal.boundingBox();
    expect(afterDrag).toBeTruthy();
    expect(afterDrag!.x).toBeLessThan(before!.x - 40);
    expect(afterDrag!.y).toBeLessThan(before!.y - 20);

    const resize = page.getByTestId("ts-notes-resize-handle");
    const resizeBox = await resize.boundingBox();
    expect(resizeBox).toBeTruthy();
    await page.mouse.move(
      resizeBox!.x + resizeBox!.width / 2,
      resizeBox!.y + resizeBox!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      resizeBox!.x + resizeBox!.width / 2 + 80,
      resizeBox!.y + resizeBox!.height / 2 + 60,
      { steps: 10 },
    );
    await page.mouse.up();

    const afterResize = await modal.boundingBox();
    expect(afterResize).toBeTruthy();
    expect(afterResize!.width).toBeGreaterThan(before!.width + 40);
    expect(afterResize!.height).toBeGreaterThan(before!.height + 20);

    await page.getByTestId("ts-notes-fold").click();
    await expect(modal).toHaveAttribute("data-folded", "true");
    await expect(page.getByTestId("ts-notes-editor")).toHaveCount(0);

    const foldedGeom = await page.evaluate((key) => localStorage.getItem(key), NOTES_WINDOW_KEY);
    const foldedFlag = await page.evaluate((key) => localStorage.getItem(key), NOTES_FOLDED_KEY);
    expect(foldedGeom).toBeTruthy();
    expect(foldedFlag).toBe("1");
    const parsed = JSON.parse(foldedGeom!) as {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    expect(parsed.x).toBeGreaterThanOrEqual(afterResize!.x - 24);
    expect(parsed.x).toBeLessThanOrEqual(afterResize!.x + 24);
    expect(parsed.width).toBeGreaterThan(before!.width + 40);

    await page.reload();
    await page.getByTestId("ts-open-notes").click();
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("data-folded", "true");
    const restored = await modal.boundingBox();
    expect(restored).toBeTruthy();
    expect(Math.abs(restored!.x - afterResize!.x)).toBeLessThan(24);
    expect(Math.abs(restored!.width - afterResize!.width)).toBeLessThan(24);

    await page.getByTestId("ts-notes-fold").click();
    await expect(modal).toHaveAttribute("data-folded", "false");
    await expect(page.getByTestId("ts-notes-editor")).toBeVisible();
    const unfolded = await modal.boundingBox();
    expect(unfolded!.height).toBeGreaterThan(restored!.height + 40);
  });

  test("notes and Ask AI coexist on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    await page.getByTestId("ts-open-notes").click();
    await expect(page.getByTestId("ts-notes-modal")).toBeVisible();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    await expect(page.locator(".ts-app-shell")).not.toHaveClass(
      /is-notes-pinned/,
    );
  });

  test("notes mobile sheet opens, folds, and closes without dock insets", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-notes").click();
    const modal = page.getByTestId("ts-notes-modal");
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("data-sheet", "true");
    await expect(page.locator(".ts-app-shell")).not.toHaveClass(
      /is-notes-pinned/,
    );

    await page.getByTestId("ts-notes-fold").click();
    await expect(modal).toHaveAttribute("data-folded", "true");
    await page.getByTestId("ts-notes-fold").click();
    await expect(page.getByTestId("ts-notes-editor")).toBeVisible();
    await page.getByTestId("ts-notes-close").click();
    await expect(modal).toBeHidden();
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
      ({ progressKey, notesKey, aiKey, windowKey, foldedKey, chatKey }) => {
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
          windowKey,
          JSON.stringify({ version: 1, x: 40, y: 40, width: 320, height: 400 }),
        );
        localStorage.setItem(foldedKey, "1");
        localStorage.setItem(
          aiKey,
          JSON.stringify({
            version: "1",
            acceptedAt: "2026-08-10T12:00:00.000Z",
          }),
        );
        localStorage.setItem(
          chatKey,
          JSON.stringify({
            version: 1,
            updatedAt: "2026-08-10T12:00:00.000Z",
            messages: [{ role: "user", content: "clear-all should wipe me" }],
          }),
        );
      },
      {
        progressKey: PROGRESS_STORAGE_KEY,
        notesKey: NOTES_STORAGE_KEY,
        aiKey: AI_RISK_STORAGE_KEY,
        windowKey: NOTES_WINDOW_KEY,
        foldedKey: NOTES_FOLDED_KEY,
        chatKey: CHAT_HISTORY_KEY,
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
    expect(await page.evaluate((k) => localStorage.getItem(k), NOTES_WINDOW_KEY)).toBeNull();
    expect(await page.evaluate((k) => localStorage.getItem(k), NOTES_FOLDED_KEY)).toBeNull();
    expect(await page.evaluate((k) => localStorage.getItem(k), AI_RISK_STORAGE_KEY)).toBeNull();
    expect(await page.evaluate((k) => localStorage.getItem(k), CHAT_HISTORY_KEY)).toBeNull();

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
