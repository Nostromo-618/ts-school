import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "arrays-and-tuples",
  title: "Arrays and tuples",
  tier: "beginner",
  track: "types",
  order: 2,
  summary:
    "T[] for a homogeneous list, [string, number] for a fixed shape, and why the difference matters the moment you destructure.",
  prerequisites: ["primitive-types"],
  keywords: [
    "array",
    "tuple",
    "readonly array",
    "destructuring",
    "fixed length",
  ],
  problem:
    "An array of anything is an array of nothing in particular, so a list of pairs and a list of strings type-check identically.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
