import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "testing-error-paths",
  title: "Testing the failure cases",
  tier: "intermediate",
  track: "testing",
  order: 9,
  summary:
    "Asserting on a typed error or a Result variant, and why catching in a test needs the same unknown handling as production code.",
  prerequisites: ["result-types", "assertions-and-narrowing-in-tests"],
  keywords: ["error", "Result", "rejects", "throws", "unknown", "catch"],
  problem:
    "expect(fn).toThrow() passes for the wrong error, and a caught value in a test is unknown just as it is everywhere else.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
