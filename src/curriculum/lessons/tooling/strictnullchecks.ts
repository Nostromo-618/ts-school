import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "strictnullchecks",
  title: "strictNullChecks",
  tier: "intermediate",
  track: "tooling",
  order: 6,
  summary:
    "The rung that pays for the whole migration. What it flags, why the error count is front-loaded, and the patterns that clear it fastest.",
  prerequisites: ["the-strictness-ladder", "null-and-undefined"],
  keywords: ["strictNullChecks", "null", "undefined", "flag", "migration"],
  problem:
    "Cannot read properties of undefined is the most common runtime error in Node, and this is the flag that finds it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
