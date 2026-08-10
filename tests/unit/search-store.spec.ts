import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { allLessons, lessonRoute } from "@/curriculum";
import { nav, navSections } from "@/nav";
import {
  hasNearTokenAnchor,
  hasSubstringAnchor,
  isLexicallyGrounded,
  refineSearchHits,
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
  // One more macrotask: ensureEngine/initFuzzy reject on the next turn in jsdom.
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
    expect(store.results).toEqual([]);
  });

  it("clears stale results as soon as the query changes", async () => {
    const store = useSearchStore();
    await query(store, "unknown");
    expect(store.results.length).toBeGreaterThan(0);

    store.query = "music";
    expect(store.results).toEqual([]);
  });

  it("returns no results for nonsense queries", async () => {
    const store = useSearchStore();
    for (const nonsense of ["music", "water", "zzzzz"]) {
      await query(store, nonsense);
      expect(store.results, nonsense).toEqual([]);
    }
  });

  it("returns relevant hits for curriculum terms", async () => {
    const store = useSearchStore();

    await query(store, "unknown");
    expect(
      store.results.some((result) => /unknown/i.test(result.entry.title)),
    ).toBe(true);

    await query(store, "noImplicitAny");
    expect(
      store.results.some((result) =>
        /noImplicitAny/i.test(result.entry.title),
      ),
    ).toBe(true);

    await query(store, "arrays");
    expect(
      store.results.some((result) => /array/i.test(result.entry.title)),
    ).toBe(true);
  });
});

describe("lexical grounding and refineSearchHits", () => {
  const noImplicitAny = {
    title: "noImplicitAny",
    route: "/lessons/strictness/no-implicit-any",
    keywords: ["noImplicitAny", "implicit any"],
    headings: ["Why noImplicitAny exists"],
  };
  const interop = {
    title: "Interop between the two module systems",
    route: "/lessons/modules/interop",
    keywords: ["createRequire", "interop", "intermediate"],
    headings: [],
  };
  const arrays = {
    title: "Arrays and tuples",
    route: "/lessons/structures/arrays-and-tuples",
    keywords: ["array", "tuple"],
    headings: ["Readonly arrays"],
  };
  const unknown = {
    title: "unknown against any",
    route: "/lessons/types/unknown-against-any",
    keywords: ["unknown", "any"],
    headings: [],
  };
  const generics = {
    title: "Generics: keeping the caller's type",
    route: "/lessons/generics/keeping-the-callers-type",
    keywords: ["generic", "type parameter"],
    headings: [],
  };

  it("rejects scattered Fuse-style matches for music/water", () => {
    expect(isLexicallyGrounded(noImplicitAny, "music")).toBe(false);
    expect(hasSubstringAnchor(noImplicitAny, "music")).toBe(false);
    expect(hasNearTokenAnchor(noImplicitAny, "music")).toBe(false);

    expect(isLexicallyGrounded(interop, "water")).toBe(false);
    expect(hasSubstringAnchor(interop, "water")).toBe(false);
  });

  it("accepts exact curriculum terms and light typos", () => {
    expect(isLexicallyGrounded(unknown, "unknown")).toBe(true);
    expect(isLexicallyGrounded(noImplicitAny, "noImplicitAny")).toBe(true);
    expect(isLexicallyGrounded(arrays, "arrays")).toBe(true);
    expect(hasNearTokenAnchor(generics, "genrics")).toBe(true);
    expect(hasNearTokenAnchor(arrays, "arays")).toBe(true);
  });

  it("drops ungrounded fuzzy hits and keeps grounded / semantic ones", () => {
    const refined = refineSearchHits(
      [
        { doc: noImplicitAny, score: 0.997, source: "fuzzy" as const },
        { doc: interop, score: 1, source: "fuzzy" as const },
        { doc: arrays, score: 0.99, source: "fuzzy" as const },
        {
          doc: { title: "Semantic neighbour" },
          score: 0.4,
          source: "semantic" as const,
        },
      ],
      "music",
    );

    expect(refined.map((hit) => hit.doc.title)).toEqual([
      "Semantic neighbour",
    ]);
  });

  it("returns empty when every fuzzy hit fails the relevance floor", () => {
    expect(
      refineSearchHits(
        [
          { doc: noImplicitAny, score: 0.997, source: "fuzzy" as const },
          { doc: interop, score: 1, source: "fuzzy" as const },
        ],
        "water",
      ),
    ).toEqual([]);
  });

  it("boosts title substring hits above keyword-only fuzzy scores", () => {
    const refined = refineSearchHits(
      [
        {
          doc: {
            title: "Promise<T>",
            keywords: ["generics"],
            route: "/lessons/async/promise",
          },
          score: 1,
          source: "fuzzy" as const,
        },
        {
          doc: generics,
          score: 0.95,
          source: "fuzzy" as const,
        },
      ],
      "generics",
    );

    expect(refined[0]?.doc.title).toMatch(/Generics/i);
    expect(refined[0]!.score).toBeGreaterThan(refined[1]!.score);
  });

  it("keeps near-token typos above the near-match score floor", () => {
    const kept = refineSearchHits(
      [{ doc: generics, score: 0.9, source: "fuzzy" as const }],
      "genrics",
    );
    expect(kept).toHaveLength(1);

    const dropped = refineSearchHits(
      [{ doc: generics, score: 0.2, source: "fuzzy" as const }],
      "genrics",
    );
    expect(dropped).toHaveLength(0);
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
