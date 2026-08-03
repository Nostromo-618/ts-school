import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "shimming-untyped-dependencies",
  title: "Dependencies with no types",
  tier: "advanced",
  track: "node-migration",
  order: 22,
  summary:
    "declare module shims, writing just enough of a definition to be useful, and when to send it to DefinitelyTyped instead of keeping it.",
  prerequisites: ["module-augmentation", "installing-types"],
  keywords: ["declare module", "shim", "ambient", "DefinitelyTyped", "untyped"],
  problem:
    "One untyped dependency in a hot path turns a whole call graph into any, and noImplicitAny cannot see through it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
