import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "overload-resolution-order",
  title: "How an overload is chosen",
  tier: "advanced",
  track: "functions",
  order: 20,
  summary:
    "The checker tries signatures in declaration order and takes the first that fits. Why that makes ordering load-bearing and generic overloads risky.",
  prerequisites: ["function-overloads", "assignability-rules"],
  keywords: ["overload", "resolution", "order", "arity", "declaration"],
  problem:
    "Adding a convenience overload at the top of the list quietly captures calls that were meant for the one below it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
