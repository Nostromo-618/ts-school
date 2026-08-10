import AxeBuilder from "@axe-core/playwright";
import { expect, FIXTURE_LESSON, TOC_VERSION, test } from "./fixtures";

const routes = [
  { name: "home", path: "/" },
  { name: "curriculum", path: "/curriculum" },
  { name: "lesson", path: FIXTURE_LESSON.path },
  { name: "history", path: "/history" },
  { name: "glossary", path: "/glossary" },
  { name: "about", path: "/about" },
  { name: "terms", path: "/terms" },
  { name: "profile", path: "/profile" },
] as const;

async function expectNoBlockingAxe(
  page: import("@playwright/test").Page,
): Promise<void> {
  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast"])
    .analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    blocking,
    blocking.map((v) => `${v.id}: ${v.help}`).join("\n") || undefined,
  ).toEqual([]);
}

test.describe("a11y smoke", () => {
  for (const route of routes) {
    test(`${route.name} has no serious or critical axe violations`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      await expectNoBlockingAxe(page);
    });
  }
});

test.describe("a11y farewell", () => {
  test.use({ skipTocSeed: true });

  test("farewell has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.addInitScript((version) => {
      sessionStorage.setItem("ts-school-toc-declined", version);
    }, TOC_VERSION);
    await page.goto("/farewell");
    await page.waitForLoadState("networkidle");
    await expectNoBlockingAxe(page);
  });
});

test.describe("a11y disclaimer gate", () => {
  test.use({ skipTocSeed: true });

  test("disclaimer gate overlay has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("disclaimer-gate")).toBeVisible();
    await expectNoBlockingAxe(page);
  });
});

test.describe("a11y notes modal", () => {
  test("notes modal has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.goto("/profile");
    await page.getByTestId("ts-open-notes").click();
    await expect(page.getByTestId("ts-notes-modal")).toBeVisible();
    await expectNoBlockingAxe(page);
  });
});
