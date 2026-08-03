import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "any-and-implicit-any",
  title: "any, and the implicit any leak",
  tier: "beginner",
  track: "foundations",
  order: 8,
  summary:
    "any switches the checker off for everything it touches, and untyped parameters hand it to you without asking. Where it leaks in and how to see it.",
  prerequisites: ["annotations-vs-inference"],
  keywords: ["any", "implicit any", "noImplicitAny", "escape hatch", "unsound"],
  problem:
    "One any at the edge of a module silently disables checking for every value derived from it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
