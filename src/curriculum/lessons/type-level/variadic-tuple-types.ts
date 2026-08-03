import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "variadic-tuple-types",
  title: "Variadic tuple types",
  tier: "advanced",
  track: "type-level",
  order: 17,
  summary:
    "[...T, U] and spreads in tuple positions — how typed compose, curry, and Promise.all keep every element's type in order.",
  prerequisites: ["rest-parameters", "infer-keyword"],
  keywords: ["variadic tuple", "spread", "tuple", "compose", "Promise.all"],
  problem:
    "A function that appends an argument to another function's parameter list cannot be typed without tuple manipulation.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
