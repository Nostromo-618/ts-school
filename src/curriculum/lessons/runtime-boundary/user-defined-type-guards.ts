import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "user-defined-type-guards",
  title: "Writing a type guard",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 6,
  summary:
    "value is User turns a boolean function into a narrowing one. The predicate is checked loosely, so the body has to be right.",
  prerequisites: ["unknown-vs-any", "in-operator-narrowing"],
  keywords: ["type predicate", "is", "type guard", "narrowing", "validation"],
  problem:
    "A validator that returns boolean proves nothing to the checker, so every caller still has to assert.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
