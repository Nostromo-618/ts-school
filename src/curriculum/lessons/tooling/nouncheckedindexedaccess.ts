import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "nouncheckedindexedaccess",
  title: "noUncheckedIndexedAccess",
  tier: "intermediate",
  track: "tooling",
  order: 9,
  summary:
    "Indexing an array or a record yields T | undefined, which is the truth. Not part of strict, and the highest-value flag outside it.",
  prerequisites: ["array-narrowing", "index-signatures"],
  keywords: [
    "noUncheckedIndexedAccess",
    "array",
    "index",
    "undefined",
    "record",
  ],
  problem:
    "map[key] is typed as present for every key, so a cache miss is typed identically to a cache hit.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
