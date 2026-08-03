import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "when-not-to-type-level-program",
  title: "When not to do any of this",
  tier: "advanced",
  track: "type-level",
  order: 21,
  summary:
    "The maintenance argument: who reads this code next, what its error messages look like when it fails, and the runtime check that would have been enough.",
  prerequisites: ["type-level-performance"],
  keywords: [
    "maintenance",
    "readability",
    "trade-off",
    "error messages",
    "judgement",
  ],
  problem:
    "The most impressive type in a codebase is often the one nobody else can change, which makes it a liability rather than an asset.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
