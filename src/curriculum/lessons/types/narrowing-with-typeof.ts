import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "narrowing-with-typeof",
  title: "Narrowing with typeof",
  tier: "beginner",
  track: "types",
  order: 8,
  summary:
    "A typeof check does not just branch at runtime; it changes the type inside the branch. Plus the one lie typeof still tells about null.",
  prerequisites: ["union-types"],
  keywords: ["typeof", "narrowing", "type guard", "control flow", "branch"],
  problem:
    "You checked the type on line 3, but on line 7 the value is still a union as far as anything reading the code can tell.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
