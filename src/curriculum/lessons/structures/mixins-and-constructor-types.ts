import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "mixins-and-constructor-types",
  title: "Mixins",
  tier: "advanced",
  track: "structures",
  order: 22,
  summary:
    "Functions that take a class and return a subclass, typed with constructor signatures — composition where single inheritance runs out.",
  prerequisites: [
    "static-members-and-static-blocks",
    "generic-classes-and-interfaces",
  ],
  keywords: [
    "mixin",
    "constructor type",
    "abstract construct signature",
    "composition",
  ],
  problem:
    "Two orthogonal behaviours both want to be a base class, and JavaScript gives you one prototype chain.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
