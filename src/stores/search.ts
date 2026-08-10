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
 *
 * Fuzzy hits are post-filtered for lexical grounding (title/keywords/route/
 * headings substring or near-token typo). Ungrounded Fuse bitap matches —
 * which often score near-perfect on scattered characters — are dropped so
 * nonsense queries show an empty state instead of unrelated lessons.
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

/**
 * Fuse threshold passed to Neptune (0 = exact, 1 = match anything).
 * Default Neptune 0.45 is far too loose against long bodyText.
 */
export const FUSE_THRESHOLD = 0.28;

/**
 * Minimum display score (`1 - fuseScore`) for fuzzy hits that only survive via
 * near-token typo tolerance (not a contiguous substring). Exact/substring
 * anchors bypass this floor.
 */
export const FUZZY_NEAR_MATCH_SCORE_FLOOR = 0.55;

/** Primary fields used for lexical grounding — never bodyText/chunks. */
export type LexicalDoc = {
  title?: string;
  route?: string;
  keywords?: string[];
  headings?: string[];
};

type RankableHit = {
  doc: LexicalDoc & { id?: string; icon?: string; category?: string; tab?: string };
  score: number;
  source: "fuzzy" | "semantic" | "substring";
};

/** Progress payload from Neptune `onSemanticProgress`. */
export type SemanticProgressEvent = {
  stage?: string;
  message?: string;
  progress?: { loaded?: number; total?: number };
};

/**
 * Map a Neptune semantic progress event to footer status.
 *
 * Neptune (and transformers.js) can report `downloading` at 100% while the
 * extractor promise and vectors are still finishing — leaving "Downloading
 * model… 100%" stuck until `ready`. Treat ≥100% as download-complete and clear
 * the downloading copy; show ready / error only from those stages.
 */
export function semanticStatusFromProgress(
  data: SemanticProgressEvent,
):
  | { kind: "ready" }
  | { kind: "error"; message: string }
  | { kind: "status"; message: string }
  | { kind: "clear" } {
  if (data.stage === "ready") return { kind: "ready" };
  if (data.stage === "error") {
    return {
      kind: "error",
      message: data.message || "Semantic search unavailable",
    };
  }

  const pct = downloadPercent(data);
  if (
    (data.stage === "downloading" || data.stage === "loading-model") &&
    pct !== null &&
    pct >= 100
  ) {
    return { kind: "clear" };
  }

  if (data.message) return { kind: "status", message: data.message };
  return { kind: "clear" };
}

function downloadPercent(data: SemanticProgressEvent): number | null {
  const loaded = data.progress?.loaded;
  const total = data.progress?.total;
  if (typeof loaded === "number" && typeof total === "number" && total > 0) {
    return Math.round((loaded / total) * 100);
  }
  const match = data.message?.match(/(\d+)\s*%/);
  return match ? Number(match[1]) : null;
}

function primaryFieldsRaw(doc: LexicalDoc): string[] {
  return [
    doc.title,
    doc.route,
    ...(doc.keywords ?? []),
    ...(doc.headings ?? []),
  ]
    .map((value) => String(value ?? ""))
    .filter(Boolean);
}

function primaryFieldTexts(doc: LexicalDoc): string[] {
  return primaryFieldsRaw(doc).map((value) => value.toLowerCase());
}

/** Split on non-alnum and camelCase so `noImplicitAny` yields useful tokens. */
export function tokenizeSearchText(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2);
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const prev = new Array<number>(cols);
  const cur = new Array<number>(cols);
  for (let j = 0; j < cols; j++) prev[j] = j;
  for (let i = 1; i < rows; i++) {
    cur[0] = i;
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j < cols; j++) prev[j] = cur[j]!;
  }
  return prev[b.length]!;
}

function maxTypoDistance(queryLength: number): number {
  if (queryLength < 4) return 0;
  if (queryLength <= 8) return 1;
  return 2;
}

/** Contiguous substring in title / keywords / route / headings. */
export function hasSubstringAnchor(doc: LexicalDoc, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle.length < MIN_QUERY_LENGTH) return false;
  return primaryFieldTexts(doc).some((field) => field.includes(needle));
}

/** Single-/double-edit typo against title tokens (and short keyword tags). */
export function hasNearTokenAnchor(doc: LexicalDoc, query: string): boolean {
  const needle = query.trim().toLowerCase();
  const maxDist = maxTypoDistance(needle.length);
  if (maxDist === 0) return false;

  const tokens = new Set<string>();
  // Title only for camelCase / display words — long keyword blurbs contain
  // prose tokens like "later" that are 1 edit from unrelated queries ("water").
  for (const token of tokenizeSearchText(String(doc.title ?? ""))) {
    tokens.add(token);
  }
  for (const keyword of doc.keywords ?? []) {
    // Tag-like keywords only (not sentence-length blurbs stored as keywords).
    if (keyword.length > 32) continue;
    for (const token of tokenizeSearchText(keyword)) tokens.add(token);
  }

  for (const token of tokens) {
    if (Math.abs(token.length - needle.length) > maxDist) continue;
    if (levenshtein(token, needle) <= maxDist) return true;
  }
  return false;
}

/**
 * Fuzzy/lexical hits must be grounded in title/keywords/route/headings.
 * Fuse bitap otherwise reports near-perfect scores for scattered characters
 * (e.g. "music" → "noImplicitAny", "water" → "Interop…").
 */
export function isLexicallyGrounded(doc: LexicalDoc, query: string): boolean {
  return hasSubstringAnchor(doc, query) || hasNearTokenAnchor(doc, query);
}

function titleSubstringBoost(doc: LexicalDoc, query: string): number {
  const needle = query.trim().toLowerCase();
  const title = String(doc.title ?? "").toLowerCase();
  if (!needle || !title) return 0;
  if (title === needle) return 3;
  if (title.startsWith(needle)) return 2.5;
  if (title.includes(needle)) return 2;
  const keywords = doc.keywords ?? [];
  if (keywords.some((keyword) => keyword.toLowerCase().includes(needle))) {
    return 1;
  }
  if (String(doc.route ?? "")
    .toLowerCase()
    .includes(needle)) {
    return 0.5;
  }
  return 0;
}

/**
 * Drop ungrounded fuzzy hits, boost exact/substring title matches, and apply
 * a score floor for typo-only near matches. Semantic hits keep Neptune's
 * cosine threshold and are not lexically filtered.
 */
export function refineSearchHits<T extends RankableHit>(
  hits: T[],
  query: string,
): T[] {
  const q = query.trim();
  if (q.length < MIN_QUERY_LENGTH) return [];

  const refined: T[] = [];
  for (const hit of hits) {
    if (hit.source === "semantic") {
      refined.push(hit);
      continue;
    }
    if (!isLexicallyGrounded(hit.doc, q)) continue;

    const substring = hasSubstringAnchor(hit.doc, q);
    if (!substring && hit.score < FUZZY_NEAR_MATCH_SCORE_FLOOR) continue;

    const boost = titleSubstringBoost(hit.doc, q);
    refined.push({
      ...hit,
      score: hit.score + boost,
      source: substring && hit.source === "fuzzy" ? "substring" : hit.source,
    });
  }

  return refined.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
}

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

  function applySemanticProgress(data: SemanticProgressEvent): void {
    const next = semanticStatusFromProgress(data);
    if (next.kind === "ready") {
      semanticReady.value = true;
      statusMessage.value = "";
      return;
    }
    if (next.kind === "error") {
      semanticFailed.value = true;
      statusMessage.value = next.message;
      return;
    }
    if (next.kind === "clear") {
      statusMessage.value = "";
      return;
    }
    statusMessage.value = next.message;
  }

  async function ensureEngine(): Promise<NeptuneSearch> {
    if (engine.value) return engine.value;
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const search = new NeptuneSearch({
      indexUrl: `${base}search/search-index.json`,
      vectorsUrl: `${base}search/vectors.json`,
      maxResults: MAX_RESULTS,
      fuseThreshold: FUSE_THRESHOLD,
      loadFuse: async () => ({ default: Fuse }),
      loadTransformers: async () => import("@huggingface/transformers"),
    });
    search.onSemanticProgress((data) => {
      applySemanticProgress(data);
    });
    engine.value = search;
    void search
      .initSemantic()
      .then(() => {
        semanticReady.value = true;
        statusMessage.value = "";
      })
      .catch(() => {
        semanticFailed.value = true;
        if (
          !statusMessage.value ||
          /downloading model/i.test(statusMessage.value)
        ) {
          statusMessage.value = "Semantic search unavailable";
        }
      });
    return search;
  }

  function substringFallback(q: string): SearchResult[] {
    const ranked = refineSearchHits(
      entries.map((entry) => ({
        doc: entry,
        score: 1,
        source: "substring" as const,
      })),
      q,
    );
    return ranked.map((hit) => {
      const entry = hit.doc as SearchEntry;
      return {
        entry,
        score: hit.score,
        source: "substring" as const,
        segments: splitTitle(entry.title, q),
      };
    });
  }

  function mapRefinedHits(
    q: string,
    ranked: RankableHit[],
  ): SearchResult[] {
    return ranked.map((hit) => {
      const doc = hit.doc;
      const entry: SearchEntry = {
        id: String(doc.id ?? ""),
        title: String(doc.title ?? ""),
        route: String(doc.route ?? ""),
        icon: iconName(doc.icon),
        category: doc.category || "Lessons",
        categoryPath: categoryPathFor(doc),
        keywords: doc.keywords || [],
      };
      return {
        entry,
        score: hit.score,
        source: hit.source,
        segments: splitTitle(entry.title, q),
      };
    });
  }

  async function runSearch(raw: string): Promise<void> {
    const q = raw.trim();
    const gen = ++searchGen;
    if (q.length < MIN_QUERY_LENGTH) {
      results.value = [];
      return;
    }
    const stillCurrent = (): boolean =>
      gen === searchGen && query.value.trim() === q;
    try {
      const search = await ensureEngine();
      await search.initFuzzy();
      if (!stillCurrent()) return;
      const mode = semanticReady.value ? "hybrid" : "fuzzy";
      const response = await search.search(q, { mode });
      if (!stillCurrent()) return;
      const merged = (response.merged || []).map((hit) => ({
        doc: hit.doc as RankableHit["doc"],
        score: hit.score,
        source: (hit.source === "semantic" ? "semantic" : "fuzzy") as
          | "fuzzy"
          | "semantic",
      }));
      const ranked = refineSearchHits(merged, q);
      // Relevance floor: if nothing survives grounding, show empty — never a
      // pile of weak Fuse bitap matches.
      results.value = mapRefinedHits(q, ranked);
    } catch (err) {
      console.warn("[search] Neptune failed; substring fallback", err);
      if (!stillCurrent()) return;
      results.value = substringFallback(q);
    }
  }

  function scheduleSearch(): void {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void runSearch(query.value);
    }, DEBOUNCE_MS);
  }

  watch(
    query,
    (next) => {
      activeIndex.value = 0;
      // Drop previous hits immediately so the empty state can show while the
      // debounced search runs (and nonsense queries never leave stale lists).
      results.value = [];
      if (next.trim().length < MIN_QUERY_LENGTH) {
        searchGen += 1;
        if (debounceTimer) clearTimeout(debounceTimer);
        return;
      }
      scheduleSearch();
    },
    { flush: "sync" },
  );

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
    searchGen += 1;
    if (debounceTimer) clearTimeout(debounceTimer);
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
