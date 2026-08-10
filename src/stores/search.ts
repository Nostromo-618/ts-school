import { ref, computed, watch, shallowRef } from "vue";
import { defineStore } from "pinia";
import Fuse from "fuse.js";
import { NeptuneSearch } from "@vanduo-oss/vdl-engines/neptune-search.js";
import { nav, type NavSection, type NavTree } from "@/nav";

/**
 * Global hybrid search (Neptune fuzzy + optional semantic).
 *
 * The curriculum Neptune index under `/search/` is generated at build time.
 * Fuse is bundled (CSP-friendly). Transformers loads via Neptune when the
 * semantic path warms; failures degrade to fuzzy-only.
 */

export interface SearchEntry {
  id: string;
  title: string;
  route: string;
  icon: string;
  category: string;
  categoryPath: string;
  keywords: string[];
}

export interface SearchResult {
  entry: SearchEntry;
  score: number;
  source: "fuzzy" | "semantic" | "substring";
  /** Title split around the match, so the view can emphasise without markup. */
  segments: TitleSegments;
}

/** `match` is empty when the hit came from a keyword or the route. */
export interface TitleSegments {
  before: string;
  match: string;
  after: string;
}

export interface SearchGroup {
  category: string;
  categoryPath: string;
  results: SearchResult[];
}

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 20;
const DEBOUNCE_MS = 280;

const buildFallbackIndex = (tree: NavTree): SearchEntry[] => {
  const entries: SearchEntry[] = [];
  for (const page of tree.pages) {
    entries.push({
      id: page.id,
      title: page.title,
      route: page.route,
      icon: page.icon ?? "file",
      category: "Pages",
      categoryPath: "Pages",
      keywords: page.keywords,
    });
  }
  for (const tab of tree.tabs) {
    for (const category of tab.categories) {
      for (const section of category.sections) {
        entries.push({
          id: `${tab.id}-${category.id}-${section.id}`,
          title: section.title,
          route: section.route,
          icon: section.icon ?? "file",
          category: category.title,
          categoryPath: `${tab.title} › ${category.title}`,
          keywords: (section as NavSection).keywords ?? [],
        });
      }
    }
  }
  return entries;
};

const splitTitle = (title: string, query: string): TitleSegments => {
  const index = title.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return { before: title, match: "", after: "" };
  return {
    before: title.slice(0, index),
    match: title.slice(index, index + query.length),
    after: title.slice(index + query.length),
  };
};

function iconName(icon: string | undefined): string {
  return String(icon || "file-text").replace(/^ph-/, "");
}

function categoryPathFor(doc: { tab?: string; category?: string }): string {
  const tab = doc.tab || "";
  const category = doc.category || "Lessons";
  if (tab === "pages") return "Pages";
  const tier =
    tab === "beginner"
      ? "Beginner"
      : tab === "intermediate"
        ? "Intermediate"
        : tab === "advanced"
          ? "Advanced"
          : tab;
  return tier ? `${tier} › ${category}` : category;
}

export const useSearchStore = defineStore("search", () => {
  const isOpen = ref(false);
  const query = ref("");
  const activeIndex = ref(0);
  const results = ref<SearchResult[]>([]);
  const semanticReady = ref(false);
  const semanticFailed = ref(false);
  const statusMessage = ref("");
  const entries = buildFallbackIndex(nav);

  const engine = shallowRef<NeptuneSearch | null>(null);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let searchGen = 0;

  async function ensureEngine(): Promise<NeptuneSearch> {
    if (engine.value) return engine.value;
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const search = new NeptuneSearch({
      indexUrl: `${base}search/search-index.json`,
      vectorsUrl: `${base}search/vectors.json`,
      maxResults: MAX_RESULTS,
      loadFuse: async () => ({ default: Fuse }),
      loadTransformers: async () => import("@huggingface/transformers"),
    });
    search.onSemanticProgress((data) => {
      if (data.stage === "ready") {
        semanticReady.value = true;
        statusMessage.value = "";
      } else if (data.stage === "error") {
        semanticFailed.value = true;
        statusMessage.value = data.message || "Semantic search unavailable";
      } else if (data.message) {
        statusMessage.value = data.message;
      }
    });
    engine.value = search;
    void search
      .initSemantic()
      .then(() => {
        semanticReady.value = true;
      })
      .catch(() => {
        semanticFailed.value = true;
      });
    return search;
  }

  function substringFallback(q: string): SearchResult[] {
    const needle = q.toLowerCase();
    const out: SearchResult[] = [];
    for (const entry of entries) {
      const titleHit = entry.title.toLowerCase().includes(needle);
      const keywordHit = entry.keywords.some((keyword) =>
        keyword.toLowerCase().includes(needle),
      );
      const routeHit = entry.route.toLowerCase().includes(needle);
      if (titleHit || keywordHit || routeHit) {
        out.push({
          entry,
          score: titleHit ? 3 : keywordHit ? 2 : 1,
          source: "substring",
          segments: splitTitle(entry.title, q),
        });
      }
    }
    return out.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
  }

  async function runSearch(raw: string): Promise<void> {
    const q = raw.trim();
    const gen = ++searchGen;
    if (q.length < MIN_QUERY_LENGTH) {
      results.value = [];
      return;
    }
    try {
      const search = await ensureEngine();
      await search.initFuzzy();
      if (gen !== searchGen) return;
      const mode = semanticReady.value ? "hybrid" : "fuzzy";
      const response = await search.search(q, { mode });
      if (gen !== searchGen) return;
      const merged = response.merged || [];
      results.value = merged.map((hit) => {
        const doc = hit.doc;
        const entry: SearchEntry = {
          id: doc.id,
          title: doc.title,
          route: doc.route,
          icon: iconName(doc.icon),
          category: doc.category || "Lessons",
          categoryPath: categoryPathFor(doc),
          keywords: doc.keywords || [],
        };
        return {
          entry,
          score: hit.score,
          source: hit.source === "semantic" ? "semantic" : "fuzzy",
          segments: splitTitle(entry.title, q),
        };
      });
    } catch (err) {
      console.warn("[search] Neptune failed; substring fallback", err);
      if (gen !== searchGen) return;
      results.value = substringFallback(q);
    }
  }

  function scheduleSearch(): void {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void runSearch(query.value);
    }, DEBOUNCE_MS);
  }

  watch(query, () => {
    activeIndex.value = 0;
    scheduleSearch();
  });

  const groups = computed<SearchGroup[]>(() => {
    const map = new Map<string, SearchGroup>();
    for (const result of results.value) {
      const key = result.entry.categoryPath;
      let group = map.get(key);
      if (!group) {
        group = {
          category: result.entry.category,
          categoryPath: result.entry.categoryPath,
          results: [],
        };
        map.set(key, group);
      }
      group.results.push(result);
    }
    return [...map.values()];
  });

  const ordered = computed<SearchResult[]>(() =>
    groups.value.flatMap((group) => group.results),
  );

  const open = (): void => {
    isOpen.value = true;
    activeIndex.value = 0;
    void ensureEngine();
  };
  const close = (): void => {
    isOpen.value = false;
    query.value = "";
    activeIndex.value = 0;
    results.value = [];
  };
  const move = (delta: number): void => {
    const count = ordered.value.length;
    if (count === 0) return;
    activeIndex.value = (activeIndex.value + delta + count) % count;
  };
  const setActiveIndex = (index: number): void => {
    activeIndex.value = index;
  };

  const searchNow = (): void => {
    if (debounceTimer) clearTimeout(debounceTimer);
    void runSearch(query.value);
  };

  return {
    isOpen,
    query,
    activeIndex,
    entries,
    results,
    groups,
    ordered,
    semanticReady,
    semanticFailed,
    statusMessage,
    open,
    close,
    move,
    setActiveIndex,
    searchNow,
  };
});
