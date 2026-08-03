import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-level-assertions-and-equality",
  title: "Comparing two types",
  tier: "advanced",
  track: "type-level",
  order: 19,
  summary:
    "Why Equal<A, B> is surprisingly hard, what the conditional-identity trick actually tests, and how to build assertions you can trust.",
  prerequisites: ["conditional-types-intro", "assignability-rules"],
  keywords: ["Equal", "type assertion", "identity", "Expect", "type test"],
  problem:
    "Mutual assignability is not equality, so the obvious type-equality check quietly passes for any and never.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
