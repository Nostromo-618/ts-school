import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "declaration-files-intro",
  title: "Where types come from: .d.ts files",
  tier: "beginner",
  track: "foundations",
  order: 11,
  summary:
    "The types for lodash, express, and node itself are just files. Where they live, how TypeScript finds them, and what to do when a package has none.",
  prerequisites: ["types-are-erased"],
  keywords: [
    "d.ts",
    "declaration file",
    "@types",
    "DefinitelyTyped",
    "ambient",
  ],
  problem:
    "An import from an untyped package resolves to any, and nothing in the editor tells you that checking just stopped.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
