import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "non-null-assertion",
  title: "The non-null assertion",
  tier: "beginner",
  track: "runtime-boundary",
  order: 5,
  summary:
    "! silences one specific complaint. The handful of cases where the programmer really does know better, and the far larger set where they do not.",
  prerequisites: ["type-assertions-are-claims", "null-and-undefined"],
  keywords: [
    "non-null assertion",
    "bang",
    "undefined",
    "strictNullChecks",
    "escape hatch",
  ],
  problem:
    "A bang at the end of an expression is the shortest way to turn a compile error into a production stack trace.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
