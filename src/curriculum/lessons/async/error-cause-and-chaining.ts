import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "error-cause-and-chaining",
  title: "Error.cause",
  tier: "intermediate",
  track: "async",
  order: 7,
  summary:
    "Wrapping a low-level failure in a domain error without losing it. How cause is typed, and why unknown is the honest type for it.",
  prerequisites: ["custom-error-classes"],
  keywords: ["cause", "error chaining", "wrapping", "context", "unknown"],
  problem:
    "Catching and rethrowing with a friendlier message throws away the only stack trace that pointed at the real failure.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
