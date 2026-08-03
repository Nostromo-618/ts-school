import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "generics-intro",
  title: "Generics: keeping the caller's type",
  tier: "intermediate",
  track: "functions",
  order: 7,
  summary:
    "A type parameter is a hole the caller fills. The difference between a function that takes any and one that takes T is the difference between forgetting and remembering.",
  prerequisites: ["typing-parameters-and-returns", "union-types"],
  keywords: ["generic", "type parameter", "identity", "reuse", "inference"],
  problem:
    "A helper typed with any hands back any, so one utility function erases types across the entire codebase that uses it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
