import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "recursive-types",
  title: "Recursive types",
  tier: "advanced",
  track: "type-level",
  order: 14,
  summary:
    "Self-referential types for trees, linked structures, and JSON. How lazy resolution makes them possible and where it gives up.",
  prerequisites: ["type-aliases-intro", "conditional-types-intro"],
  keywords: ["recursive type", "json", "tree", "self reference", "lazy"],
  problem:
    "JSON has no fixed shape, so the honest type for it is recursive and most codebases substitute any instead.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
