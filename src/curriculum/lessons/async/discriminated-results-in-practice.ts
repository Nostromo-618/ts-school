import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "discriminated-results-in-practice",
  title: "A service that never throws",
  tier: "intermediate",
  track: "async",
  order: 9,
  summary:
    "Designing a module boundary around Result: where to convert exceptions, how to keep the union small, and when to give up and throw.",
  prerequisites: ["result-types", "exhaustiveness-checking"],
  keywords: ["Result", "boundary", "service", "error handling", "design"],
  problem:
    "Result types used everywhere become noise; used nowhere they become surprises. The boundary is the whole decision.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
