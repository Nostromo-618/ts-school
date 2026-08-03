import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "extending-interfaces",
  title: "Extending an interface",
  tier: "beginner",
  track: "structures",
  order: 6,
  summary:
    "extends adds to a shape and checks that the addition is compatible — which is the difference from an intersection that silently produces never.",
  prerequisites: ["interface-vs-type-alias"],
  keywords: [
    "extends",
    "inheritance",
    "interface",
    "compatibility",
    "conflict",
  ],
  problem:
    "Two shapes with the same property at different types can be intersected, and the result is a type nothing can satisfy.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
