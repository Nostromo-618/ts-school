import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "mapped-types-intro",
  title: "Mapped types",
  tier: "intermediate",
  track: "type-level",
  order: 8,
  summary:
    "{ [K in keyof T]: … } transforms every property of a type. This is how Partial, Readonly, and Record are actually defined.",
  prerequisites: ["keyof-operator", "indexed-access-types"],
  keywords: ["mapped type", "in keyof", "transform", "Partial", "homomorphic"],
  problem:
    "Hand-writing the nullable version of a twenty-field interface produces a second twenty-field interface to maintain.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
