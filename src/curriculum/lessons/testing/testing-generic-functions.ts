import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "testing-generic-functions",
  title: "Testing generic code",
  tier: "intermediate",
  track: "testing",
  order: 7,
  summary:
    "A generic function is not one function. Choosing the instantiations worth testing, and testing the constraint as well as the behaviour.",
  prerequisites: ["generic-constraints", "typing-your-test-files"],
  keywords: ["generic", "instantiation", "constraint", "coverage", "test"],
  problem:
    "Testing a generic helper with one type argument tests one instantiation and tells you nothing about the rest.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
