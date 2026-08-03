import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "interfaces-intro",
  title: "Interfaces",
  tier: "beginner",
  track: "structures",
  order: 1,
  summary:
    "Naming a shape so it can be referred to, extended, and shown in an error message instead of being inlined twenty times.",
  prerequisites: ["object-type-literals"],
  keywords: ["interface", "shape", "named type", "contract", "extends"],
  problem:
    "The same object literal type is repeated in six signatures, so changing it means finding all six.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
