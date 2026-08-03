import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "the-strictness-ladder",
  title: "The strictness ladder",
  tier: "beginner",
  track: "tooling",
  order: 4,
  summary:
    "The order to turn the flags on in, roughly cheapest first, so that each rung pays for itself before you climb the next one.",
  prerequisites: ["strict-mode", "tsc-cli"],
  keywords: ["strict", "ladder", "incremental", "flags", "adoption"],
  problem:
    "Turning strict on in a large codebase produces thousands of errors at once, which is indistinguishable from turning it off again.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
