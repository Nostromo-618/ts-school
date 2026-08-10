import { describe, expect, it } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { allLessons, lessonRoute, TIERS, TRACKS } from "@/curriculum";
import { nav, navbarLinkPages, navSections, tierForRoute } from "@/nav";
import { buildRoutes } from "@/router";

// vd3-docs hand-maintains its nav tree alongside its route table, so a page can
// exist in one and not the other and nothing notices. These tests are what
// replaces that review burden: nav, routes, and the registry are three views of
// one list, and any disagreement between them is a failure.

describe("derived navigation tree", () => {
  it("reaches every registered lesson exactly once", () => {
    const sectionRoutes = navSections().map((section) => section.route);
    const lessonRoutes = allLessons.map(lessonRoute);

    expect([...sectionRoutes].sort()).toEqual([...lessonRoutes].sort());
    expect(new Set(sectionRoutes).size).toBe(sectionRoutes.length);
  });

  it("names tabs after tiers and categories after tracks", () => {
    const tierIds = new Set<string>(TIERS);
    const trackIds = new Set<string>(TRACKS.map((track) => track.id));

    for (const tab of nav.tabs) {
      expect(tierIds.has(tab.id)).toBe(true);
      for (const category of tab.categories) {
        expect(trackIds.has(category.id)).toBe(true);
      }
    }
  });

  it("orders tabs down the tier ladder and categories by track order", () => {
    const tabOrder = nav.tabs.map((tab) => tab.id);
    expect(tabOrder).toEqual(TIERS.filter((tier) => tabOrder.includes(tier)));

    const trackOrder = TRACKS.map((track) => track.id);
    for (const tab of nav.tabs) {
      const categories = tab.categories.map((category) => category.id);
      expect(categories).toEqual(
        trackOrder.filter((id) => categories.includes(id)),
      );
    }
  });

  it("emits no empty tab or category", () => {
    for (const tab of nav.tabs) {
      expect(tab.categories.length).toBeGreaterThan(0);
      for (const category of tab.categories) {
        expect(category.sections.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps every section filterable and searchable", () => {
    for (const section of navSections()) {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.icon).toBeDefined();
      expect(section.keywords.length).toBeGreaterThan(0);
    }
  });

  it("lists the standalone pages that are not lessons", () => {
    const routes = nav.pages.map((page) => page.route);

    expect(routes).toContain("/");
    expect(routes).toContain("/curriculum");
    expect(routes).toContain("/glossary");
    expect(routes).toContain("/history");
    expect(routes).toContain("/about");
    expect(routes).toContain("/terms");
  });

  it("keeps Terms out of primary navbar text links", () => {
    const routes = navbarLinkPages().map((page) => page.route);

    expect(routes).toContain("/curriculum");
    expect(routes).toContain("/glossary");
    expect(routes).toContain("/history");
    expect(routes).toContain("/about");
    expect(routes).not.toContain("/");
    expect(routes).not.toContain("/profile");
    expect(routes).not.toContain("/terms");
  });

  it("maps a lesson route back to its tier tab", () => {
    const lesson = allLessons[0];

    expect(tierForRoute(lessonRoute(lesson))).toBe(lesson.tier);
    expect(tierForRoute("/not-a-lesson")).toBeNull();
  });
});

describe("derived route table", () => {
  it("adds one route per lesson", () => {
    const routes = buildRoutes();
    const paths = new Set(routes.map((route) => route.path));

    for (const lesson of allLessons) {
      expect(paths.has(lessonRoute(lesson))).toBe(true);
    }
  });

  it("keeps the catch-all last so no lesson route is swallowed", () => {
    const routes = buildRoutes();

    expect(routes[routes.length - 1].path).toBe("/:pathMatch(.*)*");
  });

  it("resolves every lesson route to its own record, not the catch-all", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: buildRoutes(),
    });

    for (const lesson of allLessons) {
      const resolved = router.resolve(lessonRoute(lesson));

      expect(resolved.name).toBe(`lesson-${lesson.id}`);
      expect(resolved.matched.length).toBeGreaterThan(0);
      expect(resolved.meta.title).toBe(lesson.title);
      // The static `props` object is what LessonPage.vue receives as lessonId.
      expect(resolved.matched[0].props.default).toEqual({
        lessonId: lesson.id,
      });
    }
  });

  it("still resolves an unknown path to not-found", () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: buildRoutes(),
    });

    expect(router.resolve("/lessons/foundations/not-a-lesson").name).toBe(
      "not-found",
    );
  });
});
