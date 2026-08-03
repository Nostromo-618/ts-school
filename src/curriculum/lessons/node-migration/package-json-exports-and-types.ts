import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "package-json-exports-and-types",
  title: "exports, types, and how consumers find them",
  tier: "intermediate",
  track: "node-migration",
  order: 11,
  summary:
    "The exports map, the types condition, subpath exports, and why the order of conditions in that object is load-bearing.",
  prerequisites: ["esm-interop", "installing-types"],
  keywords: [
    "exports",
    "types condition",
    "subpath",
    "package.json",
    "resolution",
  ],
  problem:
    "A package with an exports map and a stale top-level types field resolves fine for the author and to any for everyone else.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
