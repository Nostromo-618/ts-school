import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "excess-property-checks",
  title: "Excess property checks",
  tier: "intermediate",
  track: "structures",
  order: 11,
  summary:
    "A fresh object literal is checked more strictly than a variable holding the same object. That asymmetry is deliberate, and it explains a whole class of confusing errors.",
  prerequisites: ["type-widening-and-freshness", "interfaces-intro"],
  keywords: [
    "excess property",
    "freshness",
    "object literal",
    "typo",
    "assignability",
  ],
  problem:
    "Passing { timeout: 100 } errors on a typo'd key, and hoisting it to a variable makes the error disappear without fixing anything.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
