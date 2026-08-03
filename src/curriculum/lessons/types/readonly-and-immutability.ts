import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "readonly-and-immutability",
  title: "readonly, and how far it goes",
  tier: "intermediate",
  track: "types",
  order: 18,
  summary:
    "readonly properties, ReadonlyArray, and the honest limits: it is a compile-time promise about one level, not a frozen object.",
  prerequisites: ["const-assertions", "arrays-and-tuples"],
  keywords: [
    "readonly",
    "ReadonlyArray",
    "immutability",
    "shallow",
    "Object.freeze",
  ],
  problem:
    "Passing an array to a helper and getting it back sorted in place is a bug the type system will happily allow.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
