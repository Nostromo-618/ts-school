import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "why-types",
  title: "Why types at all",
  tier: "beginner",
  track: "foundations",
  order: 1,
  summary:
    "The class of bug a Node service ships every week — a renamed field, a string where a number was meant — and why a type checker is cheaper than the test that would have caught it.",
  prerequisites: [],
  keywords: [
    "why typescript",
    "motivation",
    "static types",
    "bugs",
    "refactoring",
  ],
  problem:
    "JavaScript happily reads a property that does not exist and gives you undefined, so the failure surfaces three functions away from the mistake.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
