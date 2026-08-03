import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "assertion-functions",
  title: "Assertion functions",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 7,
  summary:
    "asserts value is User narrows by throwing. Why it needs an explicit type annotation on the declaration, and where it beats a predicate.",
  prerequisites: ["user-defined-type-guards"],
  keywords: [
    "asserts",
    "assertion function",
    "invariant",
    "throw",
    "narrowing",
  ],
  problem:
    "Guard-and-throw at the top of a function is the natural shape, and a boolean predicate cannot express it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
