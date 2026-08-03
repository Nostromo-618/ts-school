import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "recursive-conditional-types",
  title: "Recursive conditional types",
  tier: "advanced",
  track: "type-level",
  order: 15,
  summary:
    "Conditional types that call themselves: DeepReadonly, DeepPartial, flattening, and the instantiation-depth limit that ends the fun.",
  prerequisites: [
    "recursive-types",
    "distributive-conditional-types",
    "mapped-type-modifiers",
  ],
  keywords: [
    "recursion",
    "DeepPartial",
    "DeepReadonly",
    "depth limit",
    "tail recursion",
  ],
  problem:
    "Type instantiation is excessively deep and possibly infinite is the error where type-level programming stops being free.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
