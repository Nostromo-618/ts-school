import { expect, test } from "@playwright/test";
import { FIXTURE_LESSON, LIVE_DIAGNOSTIC_SNIPPET } from "./fixtures";

test.describe("dual-pane live diagnostics", () => {
  test("renders JS and TS panes and shows a live diagnostic on edit", async ({
    page,
  }) => {
    await page.goto(FIXTURE_LESSON.path);

    await expect(
      page.getByRole("region", { name: "JavaScript and TypeScript panes" }),
    ).toBeVisible();
    await expect(
      page.getByLabel("JavaScript lesson source"),
    ).toBeVisible();
    const tsEditor = page.getByLabel("TypeScript lesson editor");
    await expect(tsEditor).toBeVisible();

    const dualPane = page.getByRole("region", {
      name: "JavaScript and TypeScript panes",
    });
    const diagnostics = dualPane.getByRole("region", {
      name: "TypeScript diagnostics",
    });
    await expect(diagnostics).toBeVisible();

    // Replace authored code with a different error so we prove the worker
    // responded live (not only the prerendered TS2345 fallback).
    await tsEditor.fill(LIVE_DIAGNOSTIC_SNIPPET);

    await expect(diagnostics.getByText(/TS2322/)).toBeVisible({
      timeout: 15_000,
    });  });
});
