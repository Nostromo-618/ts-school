import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "decorators",
  title: "Decorators",
  tier: "advanced",
  track: "structures",
  order: 23,
  summary:
    "Standard decorators and their context types, how they differ from the legacy experimental ones, and why frameworks still disagree about which to use.",
  prerequisites: ["classes-intro", "generic-utility-functions"],
  keywords: [
    "decorator",
    "experimentalDecorators",
    "metadata",
    "class",
    "framework",
  ],
  problem:
    "Two decorator designs exist in the wild, they are not compatible, and the tsconfig flag that picks between them is easy to inherit by accident.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
