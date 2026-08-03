import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "array-narrowing",
  title: "Narrowing arrays and their elements",
  tier: "intermediate",
  track: "types",
  order: 16,
  summary:
    "Array.isArray, .find returning T | undefined, and why .filter(Boolean) does not remove null from the type unless you help it.",
  prerequisites: ["arrays-and-tuples", "truthiness-narrowing"],
  keywords: [
    "Array.isArray",
    "filter",
    "find",
    "predicate",
    "noUncheckedIndexedAccess",
  ],
  problem:
    "arr[0] is typed T even on an empty array, so the safest-looking line in the file is the one that throws.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
