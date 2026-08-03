import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "truthiness-narrowing",
  title: "Truthiness narrowing",
  tier: "beginner",
  track: "types",
  order: 9,
  summary:
    "if (value) removes null, undefined, 0, NaN, and the empty string from a type. That is usually more than you meant.",
  prerequisites: ["narrowing-with-typeof", "null-and-undefined"],
  keywords: ["truthy", "falsy", "narrowing", "empty string", "zero"],
  problem:
    "if (count) skips the branch when count is 0, which is the one case the code was written to handle.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
