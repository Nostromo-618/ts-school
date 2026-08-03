import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "generic-constraints",
  title: "Constraining a type parameter",
  tier: "intermediate",
  track: "functions",
  order: 8,
  summary:
    "T extends { id: string } lets a generic function actually use its argument. Constraints are how a hole gets a shape without losing the caller's specifics.",
  prerequisites: ["generics-intro"],
  keywords: ["extends", "constraint", "bounded", "keyof", "generic"],
  problem:
    "An unconstrained type parameter can be anything, so the function body can do nothing with it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
