import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "never-returning-functions",
  title: "Functions that never return",
  tier: "intermediate",
  track: "async",
  order: 13,
  summary:
    "process.exit, a function that always throws, and assertNever — how never lets control-flow analysis see past a call.",
  prerequisites: ["void-and-never", "custom-error-classes"],
  keywords: [
    "never",
    "process.exit",
    "assertNever",
    "control flow",
    "throw helper",
  ],
  problem:
    "Extracting throw new Error(...) into a helper makes the checker believe execution continues, and the code after it becomes reachable.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
