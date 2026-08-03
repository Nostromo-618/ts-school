import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "declaration-merging",
  title: "Declaration merging",
  tier: "intermediate",
  track: "structures",
  order: 19,
  summary:
    "Two interfaces with the same name become one. The feature behind global augmentation, and the reason a stray declaration can change a type you never touched.",
  prerequisites: ["interface-vs-type-alias", "type-space-vs-value-space"],
  keywords: [
    "declaration merging",
    "augmentation",
    "global",
    "interface",
    "namespace",
  ],
  problem:
    "An interface you did not write gained a property because a dependency declared one with the same name.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
