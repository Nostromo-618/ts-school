import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { nav, type NavSection, type NavTree } from "@/nav";

/**
 * Global search.
 *
 * Ported from `vd3-docs/src/stores/search.ts`. The store is unchanged in shape;
 * what changed is where the index comes from. `vd3-docs` indexes a hand-written
 * nav tree, so a page missing from that file is unsearchable. Here the tree is
 * derived from the curriculum, so all 201 lessons are indexed by construction.
 *
 * The match is a case-insensitive substring across title, keywords, and route.
 * That is deliberately simple: the alternative is shipping a search index and a
 * scoring library to a static site whose entire corpus is a few hundred short
 * titles, which the in-memory scan handles in well under a frame.
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

const buildIndex = (tree: NavTree): SearchEntry[] => {
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

/**
 * Split a title around the query. Returning three plain strings — rather than a
 * highlighted HTML string, as the donor did — is what lets the view emphasise
 * the match with a real `<mark>` element and no `v-html`.
 */
const splitTitle = (title: string, query: string): TitleSegments => {
  const index = title.toLowerCase().indexOf(query);
  if (index === -1) return { before: title, match: "", after: "" };
  return {
    before: title.slice(0, index),
    match: title.slice(index, index + query.length),
    after: title.slice(index + query.length),
  };
};

export const useSearchStore = defineStore("search", () => {
  const isOpen = ref(false);
  const query = ref("");
  const activeIndex = ref(0);
  const entries = buildIndex(nav);

  const results = computed<SearchResult[]>(() => {
    const q = query.value.trim().toLowerCase();
    if (q.length < MIN_QUERY_LENGTH) return [];
    const out: SearchResult[] = [];
    for (const entry of entries) {
      const titleHit = entry.title.toLowerCase().includes(q);
      const keywordHit = entry.keywords.some((keyword) =>
        keyword.toLowerCase().includes(q),
      );
      const routeHit = entry.route.toLowerCase().includes(q);
      if (titleHit || keywordHit || routeHit) {
        const score = titleHit ? 3 : keywordHit ? 2 : 1;
        out.push({ entry, score, segments: splitTitle(entry.title, q) });
      }
    }
    return out.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
  });

  /** Results grouped by their tier-and-track path, in first-seen order. */
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

  /** Results in the same order the grouped render walks them, for the cursor. */
  const ordered = computed<SearchResult[]>(() =>
    groups.value.flatMap((group) => group.results),
  );

  const open = (): void => {
    isOpen.value = true;
    activeIndex.value = 0;
  };
  const close = (): void => {
    isOpen.value = false;
    query.value = "";
    activeIndex.value = 0;
  };
  const move = (delta: number): void => {
    const count = ordered.value.length;
    if (count === 0) return;
    activeIndex.value = (activeIndex.value + delta + count) % count;
  };
  const setActiveIndex = (index: number): void => {
    activeIndex.value = index;
  };

  return {
    isOpen,
    query,
    activeIndex,
    entries,
    results,
    groups,
    ordered,
    open,
    close,
    move,
    setActiveIndex,
  };
});
