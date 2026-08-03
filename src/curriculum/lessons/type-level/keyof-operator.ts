import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "keyof-operator",
  title: "keyof",
  tier: "intermediate",
  track: "type-level",
  order: 1,
  summary:
    "The union of an object type's keys. The first operator that computes a type from a type, and the one every other lesson here builds on.",
  prerequisites: ["interfaces-intro", "union-types"],
  keywords: ["keyof", "keys", "union", "operator", "type query"],
  problem:
    "A helper that takes a property name accepts any string, so a renamed field breaks at runtime instead of at build time.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
