import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "where-types-end",
  title: "Where your types stop",
  tier: "beginner",
  track: "runtime-boundary",
  order: 1,
  summary:
    "Every request body, environment variable, CLI argument, file, and database row enters your program as a promise nobody checked. Mapping that perimeter is the first step to defending it.",
  prerequisites: ["types-are-erased"],
  keywords: ["boundary", "untrusted input", "io", "perimeter", "trust"],
  problem:
    "Types are erased before the program runs, so every annotation on incoming data is a claim rather than a check.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
