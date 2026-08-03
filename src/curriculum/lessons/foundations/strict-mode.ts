import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "strict-mode",
  title: "What strict actually turns on",
  tier: "beginner",
  track: "foundations",
  order: 9,
  summary:
    "strict is eight flags in a trench coat. What each one rejects, and why turning them on individually is the practical route for an existing codebase.",
  prerequisites: ["any-and-implicit-any"],
  keywords: ["strict", "strictNullChecks", "noImplicitAny", "flags", "config"],
  problem:
    "Without strict, TypeScript agrees that undefined is a perfectly good string, which removes most of the reason to adopt it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
