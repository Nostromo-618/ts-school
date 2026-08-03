import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "satisfies-operator",
  title: "satisfies",
  tier: "intermediate",
  track: "type-level",
  order: 6,
  summary:
    "Check a value against a type without widening it to that type — the operator that finally made typed config objects pleasant.",
  prerequisites: ["type-widening-and-freshness", "const-assertions"],
  keywords: ["satisfies", "widening", "config", "as const", "checking"],
  problem:
    "Annotating a config object checks it and throws away everything specific about it; leaving it unannotated keeps the detail and checks nothing.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
