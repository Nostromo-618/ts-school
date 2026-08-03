import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "intersection-types",
  title: "Intersection types",
  tier: "intermediate",
  track: "structures",
  order: 12,
  summary:
    "A & B is everything from both. How it composes mixins and props, and how it produces never when the two disagree.",
  prerequisites: ["extending-interfaces", "type-aliases-intro"],
  keywords: ["intersection", "and", "mixin", "never", "composition"],
  problem:
    "Intersecting two types with a conflicting property gives a type with a never property, and the error appears at the use site.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
