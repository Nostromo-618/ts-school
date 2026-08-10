import { expect, FIXTURE_LESSON, test } from "./fixtures";

test.describe("AI pending edit Accept/Reject", () => {
  test("accept applies proposed TS edit; reject discards", async ({ page }) => {
    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();

    await page.evaluate(() => {
      const app = document.querySelector("#app") as
        | (HTMLElement & { __vue_app__?: { config: { globalProperties: { $pinia?: unknown } } } })
        | null;
      const pinia = app?.__vue_app__?.config?.globalProperties?.$pinia as
        | { _s?: Map<string, { proposeTsEdit: (s: string) => void; tsCode: string }> }
        | undefined;
      const store = pinia?._s?.get("lessonEditor");
      if (!store) throw new Error("lessonEditor store missing");
      store.proposeTsEdit("const patched: number = 42;\n");
    });

    await expect(page.getByTestId("ts-ai-pending-edit")).toBeVisible();
    await page.getByTestId("ts-ai-accept-edit").click();
    await expect(page.getByTestId("ts-ai-pending-edit")).toHaveCount(0);
    await expect(page.getByLabel("TypeScript lesson editor")).toHaveValue(
      /const patched: number = 42/,
    );

    await page.evaluate(() => {
      const app = document.querySelector("#app") as
        | (HTMLElement & { __vue_app__?: { config: { globalProperties: { $pinia?: unknown } } } })
        | null;
      const pinia = app?.__vue_app__?.config?.globalProperties?.$pinia as
        | { _s?: Map<string, { proposeTsEdit: (s: string) => void; tsCode: string }> }
        | undefined;
      const store = pinia?._s?.get("lessonEditor");
      if (!store) throw new Error("lessonEditor store missing");
      store.proposeTsEdit("const rejected: string = 'no';\n");
    });
    await expect(page.getByTestId("ts-ai-pending-edit")).toBeVisible();
    const before = await page.getByLabel("TypeScript lesson editor").inputValue();
    await page.getByTestId("ts-ai-reject-edit").click();
    await expect(page.getByTestId("ts-ai-pending-edit")).toHaveCount(0);
    await expect(page.getByLabel("TypeScript lesson editor")).toHaveValue(before);
  });
});
