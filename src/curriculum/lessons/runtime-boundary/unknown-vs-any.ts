import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "unknown-vs-any",
  title: "unknown against any",
  tier: "beginner",
  track: "runtime-boundary",
  order: 2,
  summary:
    "Both accept anything. Only one makes you prove something before you use it, and that difference is the whole runtime-boundary story.",
  prerequisites: ["where-types-end", "any-and-implicit-any"],
  keywords: ["unknown", "any", "top type", "narrowing", "safety"],
  problem:
    "any propagates silently through every expression it touches; unknown stops at the first one and asks a question.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
