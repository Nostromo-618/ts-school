import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "strictfunctiontypes",
  title: "strictFunctionTypes",
  tier: "intermediate",
  track: "tooling",
  order: 7,
  summary:
    "Contravariant parameter checking for function-typed properties, the method exemption it deliberately keeps, and what that means for your callbacks.",
  prerequisites: ["the-strictness-ladder", "void-returning-callbacks"],
  keywords: [
    "strictFunctionTypes",
    "variance",
    "contravariance",
    "callback",
    "method",
  ],
  problem:
    "The flag is on, the check still does not apply to methods, and nothing explains why one of your two handlers is checked.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
