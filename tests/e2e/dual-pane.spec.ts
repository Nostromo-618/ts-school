import { expect, FIXTURE_LESSON, test } from "./fixtures";

test.describe("dual-pane static diagnostics", () => {
  test("renders JS and TS panes and shows authored build-time diagnostics", async ({
    page,
  }) => {
    await page.goto(FIXTURE_LESSON.path);

    await expect(
      page.getByRole("region", { name: "JavaScript and TypeScript panes" }),
    ).toBeVisible();
    await expect(page.getByLabel("JavaScript lesson source")).toBeVisible();
    const tsEditor = page.getByLabel("TypeScript lesson editor");
    await expect(tsEditor).toBeVisible();

    const dualPane = page.getByRole("region", {
      name: "JavaScript and TypeScript panes",
    });
    const diagnostics = dualPane.getByRole("region", {
      name: "TypeScript diagnostics",
    });
    await expect(diagnostics).toBeVisible();

    // Build-time Strada diagnostics for the authored pane (TS2345).
    await expect(diagnostics.getByText(/TS2345/)).toBeVisible();
  });

  test("editing the TS pane does not change static diagnostics", async ({
    page,
  }) => {
    await page.goto(FIXTURE_LESSON.path);
    const dualPane = page.getByRole("region", {
      name: "JavaScript and TypeScript panes",
    });
    const diagnostics = dualPane.getByRole("region", {
      name: "TypeScript diagnostics",
    });
    await expect(diagnostics.getByText(/TS2345/)).toBeVisible();
    const tsEditor = page.getByLabel("TypeScript lesson editor");
    await tsEditor.click();
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await page.keyboard.type("const ok: number = 1;");
    // Static build-time list must still show the authored diagnostic.
    await expect(diagnostics.getByText(/TS2345/)).toBeVisible();
    await expect(
      diagnostics.getByText(/Captured at build time/i),
    ).toBeVisible();
  });
});
