import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { allLessons, lessonRoute } from "@/curriculum";
import { nav, navSections } from "@/nav";
import {
  semanticStatusFromProgress,
  useSearchStore,
} from "@/stores/search";

// The search index is the second consumer of the derived nav tree, and the one
// a reader notices first when it is wrong.

async function query(store: ReturnType<typeof useSearchStore>, q: string) {
  store.query = q;
  store.searchNow();
  // Allow the async Neptune / fallback pipeline to settle.
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((r) => setTimeout(r, 0));
}

describe("search store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("indexes every lesson plus the standalone pages", () => {
    const store = useSearchStore();
    const routes = new Set(store.entries.map((entry) => entry.route));

    for (const lesson of allLessons) {
      expect(routes.has(lessonRoute(lesson))).toBe(true);
    }
    expect(routes.has("/curriculum")).toBe(true);
    expect(routes.has("/history")).toBe(true);
    expect(routes.has("/about")).toBe(true);
    expect(store.entries.length).toBe(navSections().length + nav.pages.length);
  });

  it("stays quiet below the minimum query length", async () => {
    const store = useSearchStore();
    await query(store, "a");
    expect(store.results).toEqual([]);
  });

  it("matches titles, keywords, and routes", async () => {
    const store = useSearchStore();

    await query(store, "narrowing");
    expect(store.results.length).toBeGreaterThan(0);

    // "prototype pollution" appears in a lesson's keywords, not its title.
    await query(store, "prototype pollution");
    const keywordHit = store.results.find((result) =>
      result.entry.id.endsWith("deserialization-attack-surface"),
    );
    expect(keywordHit).toBeDefined();

    await query(store, "/lessons/node-migration/");
    expect(store.results.length).toBeGreaterThan(0);
  });

  it("ranks title matches above keyword and route matches", async () => {
    const store = useSearchStore();
    await query(store, "generics");
    const scores = store.results.map((result) => result.score);

    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("splits the title so the view can emphasise without markup", async () => {
    const store = useSearchStore();
    await query(store, "generics");
    const hit = store.results.find(
      (result) => result.segments.match.length > 0,
    );

    expect(hit).toBeDefined();
    const { before, match, after } = hit!.segments;
    expect(before + match + after).toBe(hit!.entry.title);
    expect(match.toLowerCase()).toBe("generics");
  });

  it("groups results and keeps the keyboard order in step with the render", async () => {
    const store = useSearchStore();
    await query(store, "type");

    const flattened = store.groups.flatMap((group) => group.results);
    expect(store.ordered).toEqual(flattened);
    expect(store.ordered.length).toBe(store.results.length);
  });

  it("wraps the cursor at both ends", async () => {
    const store = useSearchStore();
    await query(store, "type");
    const count = store.ordered.length;
    expect(count).toBeGreaterThan(1);

    store.move(-1);
    expect(store.activeIndex).toBe(count - 1);
    store.move(1);
    expect(store.activeIndex).toBe(0);
  });

  it("clears the query when closed", async () => {
    const store = useSearchStore();
    store.open();
    await query(store, "unions");
    store.close();

    expect(store.isOpen).toBe(false);
    expect(store.query).toBe("");
    expect(store.activeIndex).toBe(0);
  });
});

describe("semanticStatusFromProgress", () => {
  it("keeps mid-download status messages", () => {
    expect(
      semanticStatusFromProgress({
        stage: "downloading",
        message: "Downloading model… 45%",
        progress: { loaded: 45, total: 100 },
      }),
    ).toEqual({ kind: "status", message: "Downloading model… 45%" });
  });

  it("clears downloading status once progress reaches 100%", () => {
    expect(
      semanticStatusFromProgress({
        stage: "downloading",
        message: "Downloading model… 100%",
        progress: { loaded: 100, total: 100 },
      }),
    ).toEqual({ kind: "clear" });

    expect(
      semanticStatusFromProgress({
        stage: "downloading",
        message: "Downloading model… 100%",
      }),
    ).toEqual({ kind: "clear" });
  });

  it("marks ready and surfaces errors", () => {
    expect(semanticStatusFromProgress({ stage: "ready" })).toEqual({
      kind: "ready",
    });
    expect(
      semanticStatusFromProgress({
        stage: "error",
        message: "boom",
      }),
    ).toEqual({ kind: "error", message: "boom" });
  });
});
