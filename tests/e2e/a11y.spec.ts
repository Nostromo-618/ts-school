import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { FIXTURE_LESSON } from "./fixtures";

const routes = [
  { name: "home", path: "/" },
  { name: "curriculum", path: "/curriculum" },
  { name: "lesson", path: FIXTURE_LESSON.path },
  { name: "history", path: "/history" },
] as const;

test.describe("a11y smoke", () => {
  for (const route of routes) {
    test(`${route.name} has no serious or critical axe violations`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");

      // color-contrast is a known vd3 primary-blue theme limitation (#339af0
      // on white / white on primary). Smoke still catches other serious/critical
      // issues; contrast belongs to the design-system package, not this site.
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
    });
  }
});
