import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "void-and-never",
  title: "void and never",
  tier: "intermediate",
  track: "types",
  order: 19,
  summary:
    "void means the return value is not to be used; never means there is no return value at all. Two very different kinds of nothing.",
  prerequisites: ["exhaustiveness-checking"],
  keywords: ["void", "never", "bottom type", "return type", "throw"],
  problem:
    "A function typed void can still return something, and a function that always throws is not typed never unless you say so.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
