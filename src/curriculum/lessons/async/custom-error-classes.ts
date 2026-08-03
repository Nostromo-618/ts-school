import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "custom-error-classes",
  title: "Custom error classes",
  tier: "intermediate",
  track: "async",
  order: 6,
  summary:
    "Extending Error, keeping instanceof working across transpilation targets, and adding typed fields without breaking the stack trace.",
  prerequisites: ["catch-gives-you-unknown", "classes-intro"],
  keywords: ["Error", "extends", "instanceof", "setPrototypeOf", "stack"],
  problem:
    "Subclassing Error and compiling down to ES5 quietly breaks instanceof, so the catch block that handles your error never runs.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
