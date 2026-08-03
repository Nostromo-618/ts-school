import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "assertions-and-narrowing-in-tests",
  title: "Assertions that narrow",
  tier: "intermediate",
  track: "testing",
  order: 3,
  summary:
    "expect(x).toBeDefined() proves nothing to the compiler. Which assertions narrow, which do not, and how to bridge the gap without casting.",
  prerequisites: ["typing-your-test-files", "assertion-functions"],
  keywords: ["assertion", "narrowing", "toBeDefined", "non-null", "expect"],
  problem:
    "Every line after a truthiness assertion still sees the nullable type, so tests fill up with bangs.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
