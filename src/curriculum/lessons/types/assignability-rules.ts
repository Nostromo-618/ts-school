import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "assignability-rules",
  title: "The assignability rules",
  tier: "advanced",
  track: "types",
  order: 24,
  summary:
    "What the checker actually asks when it asks whether A fits B: top and bottom types, union and intersection reduction, and the special cases for any.",
  prerequisites: [
    "control-flow-analysis",
    "void-and-never",
    "structural-typing",
  ],
  keywords: [
    "assignability",
    "subtyping",
    "any",
    "unknown",
    "never",
    "reduction",
  ],
  problem:
    "Type X is not assignable to type Y is the most common error in TypeScript, and almost nobody can state the rule it is enforcing.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
