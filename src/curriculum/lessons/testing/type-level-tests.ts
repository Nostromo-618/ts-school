import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-level-tests",
  title: "Testing types",
  tier: "advanced",
  track: "testing",
  order: 10,
  summary:
    "expectTypeOf, tsd, and hand-rolled Expect<Equal<A, B>> — asserting that a signature is what you think it is, as a first-class test.",
  prerequisites: [
    "type-level-assertions-and-equality",
    "typing-your-test-files",
  ],
  keywords: ["expectTypeOf", "tsd", "Equal", "type test", "assertType"],
  problem:
    "A refactor that changes an exported type breaks nothing in the test suite, because no test ever looked at a type.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
