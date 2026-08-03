import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-level-performance",
  title: "The cost of clever types",
  tier: "advanced",
  track: "type-level",
  order: 20,
  summary:
    "Instantiation counts, caching, and why one recursive helper can add seconds to every build in the repository that imports it.",
  prerequisites: [
    "recursive-conditional-types",
    "type-level-assertions-and-equality",
  ],
  keywords: [
    "performance",
    "instantiation",
    "trace",
    "compile time",
    "recursion",
  ],
  problem:
    "A clever type in a shared package makes the editor lag in every consumer, and the cost is invisible where it was written.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
