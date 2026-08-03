import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "union-types",
  title: "Union types",
  tier: "beginner",
  track: "types",
  order: 4,
  summary:
    "A | B means one of these, not both. What you may do with a union before you have narrowed it, and why that restriction is the point.",
  prerequisites: ["object-type-literals"],
  keywords: ["union", "or", "sum type", "alternatives", "assignability"],
  problem:
    "A function that returns a user or null is documented in a comment, and every caller decides for itself whether to check.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
