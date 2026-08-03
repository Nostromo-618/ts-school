import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "writing-a-validator-by-hand",
  title: "A validator you can read",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 8,
  summary:
    "Building an honest object validator from unknown up: property presence, primitive checks, arrays, and the error messages that make it usable.",
  prerequisites: ["assertion-functions", "array-narrowing"],
  keywords: [
    "validator",
    "parsing",
    "unknown",
    "runtime check",
    "error message",
  ],
  problem:
    "Every codebase writes this eventually, and the version written in a hurry checks the happy path only.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
