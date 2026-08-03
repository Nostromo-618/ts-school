import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "enums-vs-literal-unions",
  title: "Enums against unions of literals",
  tier: "beginner",
  track: "types",
  order: 11,
  summary:
    "enum emits real JavaScript, does not erase, and has surprising assignability. A union of string literals does the same job with none of that.",
  prerequisites: ["literal-types"],
  keywords: ["enum", "const enum", "literal union", "erasure", "as const"],
  problem:
    "enum is the feature that looks most familiar to developers arriving from other languages, and it is the one that behaves least like they expect.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
