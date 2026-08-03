import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "generic-async-wrappers",
  title: "Wrappers that keep the signature",
  tier: "advanced",
  track: "async",
  order: 14,
  summary:
    "withRetry, withTimeout, withSpan — decorating an async function so the wrapped signature, including its generics, survives intact.",
  prerequisites: ["variadic-tuple-types", "abortsignal-and-cancellation"],
  keywords: [
    "retry",
    "timeout",
    "wrapper",
    "decorator",
    "variadic tuple",
    "generic",
  ],
  problem:
    "A retry helper typed with (...args: any[]) => any turns every wrapped function into an untyped one.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
