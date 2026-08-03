import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "variance-and-strict-function-types",
  title: "Variance and strictFunctionTypes",
  tier: "advanced",
  track: "functions",
  order: 16,
  summary:
    "Parameters are contravariant, returns are covariant — except for methods, which stayed bivariant on purpose. What that trade actually costs you.",
  prerequisites: ["void-returning-callbacks", "assignability-rules"],
  keywords: [
    "variance",
    "covariant",
    "contravariant",
    "bivariance",
    "strictFunctionTypes",
  ],
  problem:
    "A handler that accepts a narrower event than it was registered for is accepted by the checker and crashes at runtime.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
