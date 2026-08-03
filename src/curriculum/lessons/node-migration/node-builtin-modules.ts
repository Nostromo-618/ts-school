import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "node-builtin-modules",
  title: "node: builtins and @types/node",
  tier: "beginner",
  track: "node-migration",
  order: 5,
  summary:
    "The node: prefix, what @types/node covers, and how lib and types in tsconfig decide whether you get DOM globals you do not want.",
  prerequisites: ["installing-types", "tsconfig-essentials"],
  keywords: ["node:", "@types/node", "lib", "builtin", "globals"],
  problem:
    "A Node project that inherits the DOM lib autocompletes document and window, neither of which exists at runtime.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
