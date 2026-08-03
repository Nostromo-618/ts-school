import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "exhaustiveness-checking",
  title: "Exhaustiveness checking",
  tier: "intermediate",
  track: "types",
  order: 13,
  summary:
    "Assign the narrowed value to never in the default branch and the compiler tells you the day someone adds a variant you did not handle.",
  prerequisites: ["discriminated-unions"],
  keywords: ["never", "exhaustive", "switch", "assertNever", "default case"],
  problem:
    "Adding a case to a union is a one-line change; finding the nine switch statements that needed updating is not.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
