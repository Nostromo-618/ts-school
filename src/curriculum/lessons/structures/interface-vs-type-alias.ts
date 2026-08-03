import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "interface-vs-type-alias",
  title: "Interface against type alias",
  tier: "beginner",
  track: "structures",
  order: 3,
  summary:
    "The differences that are real — declaration merging, extends against intersection, error-message quality, implicit index signatures — and the ones that are folklore.",
  prerequisites: ["interfaces-intro", "type-aliases-intro"],
  keywords: [
    "interface",
    "type alias",
    "declaration merging",
    "extends",
    "style guide",
  ],
  problem:
    "Every team argues about this and most of the arguments cite differences that stopped existing several versions ago.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
