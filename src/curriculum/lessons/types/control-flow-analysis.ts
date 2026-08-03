import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "control-flow-analysis",
  title: "How control-flow analysis works",
  tier: "advanced",
  track: "types",
  order: 21,
  summary:
    "The checker walks your code as a graph and computes a type per reference. Understanding that graph explains every narrowing that surprised you.",
  prerequisites: [
    "truthiness-narrowing",
    "equality-narrowing",
    "in-operator-narrowing",
  ],
  keywords: [
    "control flow",
    "CFA",
    "narrowing",
    "flow node",
    "aliased condition",
  ],
  problem:
    "Narrowing looks like magic until it stops working, and then there is nothing to reason about unless you know what it is actually doing.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
