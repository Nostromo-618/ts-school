import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "abortsignal-and-cancellation",
  title: "AbortSignal and cancellation",
  tier: "intermediate",
  track: "async",
  order: 12,
  summary:
    "Threading a signal through an async call chain, typing the abort reason, and why cancellation is a parameter rather than a return value.",
  prerequisites: ["async-await-typing", "typing-parameters-and-returns"],
  keywords: [
    "AbortSignal",
    "AbortController",
    "cancellation",
    "timeout",
    "signal",
  ],
  problem:
    "A request that the caller no longer wants keeps running, and there is no type-level pressure to accept a signal.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
