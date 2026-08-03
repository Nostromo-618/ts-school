import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-callbacks-and-promisify",
  title: "From callbacks to promises",
  tier: "beginner",
  track: "async",
  order: 3,
  summary:
    "Node's error-first callback convention, how its types encode it, and what util.promisify does to a signature.",
  prerequisites: ["async-await-typing", "function-type-expressions"],
  keywords: ["callback", "promisify", "error-first", "node", "util"],
  problem:
    "(err, result) => void puts the error and the result in the same tuple, and only one of them is ever present.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
