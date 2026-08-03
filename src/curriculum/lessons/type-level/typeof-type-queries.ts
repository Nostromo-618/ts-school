import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typeof-type-queries",
  title: "typeof in type position",
  tier: "intermediate",
  track: "type-level",
  order: 2,
  summary:
    "typeof config in a type annotation asks for the type of a value. The bridge from the values you already have to the types you need.",
  prerequisites: ["type-space-vs-value-space", "const-assertions"],
  keywords: ["typeof", "type query", "value to type", "inference", "config"],
  problem:
    "The config object and the Config interface are maintained separately, and they diverge on the first hurried commit.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
