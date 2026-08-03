import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "higher-order-generic-signatures",
  title: "Generic functions as values",
  tier: "advanced",
  track: "functions",
  order: 21,
  summary:
    "Passing a generic function without instantiating it, instantiation expressions, and where higher-kinded types would help if TypeScript had them.",
  prerequisites: [
    "currying-and-partial-application",
    "generic-inference-internals",
  ],
  keywords: [
    "higher order",
    "instantiation expression",
    "generic value",
    "hkt",
  ],
  problem:
    "Storing a generic function in a variable collapses it to one instantiation, and the abstraction you were building disappears.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
