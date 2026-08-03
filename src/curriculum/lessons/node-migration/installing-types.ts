import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "installing-types",
  title: "Getting types for your dependencies",
  tier: "beginner",
  track: "node-migration",
  order: 4,
  summary:
    "Bundled types, @types packages, DefinitelyTyped, and how to tell which a package uses before you install anything.",
  prerequisites: ["declaration-files-intro"],
  keywords: [
    "@types",
    "DefinitelyTyped",
    "types field",
    "dependencies",
    "bundled types",
  ],
  problem:
    "Half your dependencies ship types, a third have an @types package, and the rest resolve to any without saying so.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
