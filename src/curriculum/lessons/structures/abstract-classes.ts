import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "abstract-classes",
  title: "Abstract classes and members",
  tier: "intermediate",
  track: "structures",
  order: 14,
  summary:
    "A base that cannot be instantiated and members a subclass must supply — the one inheritance feature that carries real checking weight.",
  prerequisites: ["implements-vs-extends"],
  keywords: [
    "abstract",
    "base class",
    "template method",
    "subclass",
    "override",
  ],
  problem:
    "A base class with a method that throws 'not implemented' pushes a compile-time contract into a runtime failure.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
