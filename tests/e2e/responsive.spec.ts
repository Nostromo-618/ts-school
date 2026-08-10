import { expect, FIXTURE_LESSON, test } from "./fixtures";

test.describe("navbar mid-width layout", () => {
  test("text-link track stays clear of action icons at 1024px", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "Chromium Desktop",
      "Desktop project only",
    );
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/");

    const track = page.getByTestId("ts-navbar-links-track");
    const notes = page.getByTestId("ts-open-notes");
    await expect(track).toBeVisible();
    await expect(notes).toBeVisible();

    const trackBox = await track.boundingBox();
    const notesBox = await notes.boundingBox();
    expect(trackBox).toBeTruthy();
    expect(notesBox).toBeTruthy();
    // Scrollport ends at or before the action cluster — no paint overlap.
    expect(trackBox!.x + trackBox!.width).toBeLessThanOrEqual(notesBox!.x + 1);

    const notesReceivesHits = await page.evaluate(() => {
      const el = document.querySelector("[data-testid='ts-open-notes']");
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(
        r.left + r.width / 2,
        r.top + r.height / 2,
      );
      return Boolean(top?.closest("[data-testid='ts-open-notes']"));
    });
    expect(notesReceivesHits).toBe(true);

    const overflow = await track.evaluate(
      (el) => el.scrollWidth > el.clientWidth + 1,
    );
    if (overflow) {
      await expect(page.getByTestId("ts-navbar-scroll-next")).toBeVisible();
    }
  });

  test("chevrons scroll overflowing links when the navbar is narrowed", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "Chromium Desktop",
      "Desktop project only",
    );
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.goto("/");
    // Pinning AI docks the pane and shrinks the fixed navbar.
    await page.getByTestId("ts-open-ai-chat").click();
    await page.getByTestId("ts-ai-pin").click();
    await expect(page.locator(".ts-app-shell.is-ai-chat-pinned")).toBeVisible();

    const track = page.getByTestId("ts-navbar-links-track");
    const overflow = await track.evaluate(
      (el) => el.scrollWidth > el.clientWidth + 1,
    );
    test.skip(!overflow, "Navbar still wide enough for all links");

    const next = page.getByTestId("ts-navbar-scroll-next");
    await expect(next).toBeVisible();
    const before = await track.evaluate((el) => el.scrollLeft);
    await next.click();
    await expect
      .poll(async () => track.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(before);
  });
});

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
    await expect(page.getByLabel("TypeScript lesson editor")).toBeVisible();
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
