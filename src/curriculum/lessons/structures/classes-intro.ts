import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "classes-intro",
  title: "Classes",
  tier: "beginner",
  track: "structures",
  order: 7,
  summary:
    "Fields, constructors, and methods with types. What TypeScript adds to a JavaScript class and what it merely describes.",
  prerequisites: ["typing-parameters-and-returns", "interfaces-intro"],
  keywords: ["class", "constructor", "method", "field", "instance"],
  problem:
    "A class field assigned only in a callback is undefined for the first tick of its life, and nothing says so.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
