import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "structural-test-doubles",
  title: "Why fakes are cheap here",
  tier: "intermediate",
  track: "testing",
  order: 8,
  summary:
    "Structural typing means no interface declaration, no implements, and no framework — a plain object is a valid double if its shape matches.",
  prerequisites: ["typing-mocks-and-stubs", "interface-vs-type-alias"],
  keywords: [
    "test double",
    "fake",
    "structural",
    "dependency injection",
    "seam",
  ],
  problem:
    "Mocking frameworks exist to solve a nominal-typing problem that TypeScript does not have.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
