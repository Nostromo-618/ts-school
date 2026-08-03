import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "void-returning-callbacks",
  title: "Callbacks that return void",
  tier: "intermediate",
  track: "functions",
  order: 6,
  summary:
    "A callback typed to return void accepts a function that returns something. That rule is deliberate, useful, and occasionally a bug factory.",
  prerequisites: ["function-type-expressions", "void-and-never"],
  keywords: ["void", "callback", "return value", "forEach", "assignability"],
  problem:
    "arr.forEach(async item => ...) type-checks and the promises are dropped on the floor.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
