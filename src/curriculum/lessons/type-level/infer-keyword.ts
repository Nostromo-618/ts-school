import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "infer-keyword",
  title: "infer",
  tier: "advanced",
  track: "type-level",
  order: 10,
  summary:
    "Capturing a type out of a match inside a conditional type. The mechanism behind ReturnType, Awaited, and every parser you will write here.",
  prerequisites: ["conditional-types-intro"],
  keywords: [
    "infer",
    "conditional type",
    "pattern match",
    "extract",
    "ReturnType",
  ],
  problem:
    "Reading a type argument back out of a generic type has no syntax at all until you reach for infer.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
