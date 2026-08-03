import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-your-test-files",
  title: "Typing the tests themselves",
  tier: "beginner",
  track: "testing",
  order: 1,
  summary:
    "Getting tests into the same tsconfig as the source, where the runner's globals come from, and why tests deserve the same strictness as production code.",
  prerequisites: ["tsconfig-essentials", "installing-types"],
  keywords: ["vitest", "jest", "globals", "tsconfig", "test types"],
  problem:
    "Tests excluded from the tsconfig are the largest unchecked directory in most repositories.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
