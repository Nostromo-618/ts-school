import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "result-types",
  title: "Returning failures instead of throwing",
  tier: "intermediate",
  track: "async",
  order: 8,
  summary:
    "A Result union puts the failure in the return type, where the checker can insist you handle it. The costs are real too.",
  prerequisites: ["discriminated-unions", "catch-gives-you-unknown"],
  keywords: ["Result", "Either", "ok", "err", "typed errors", "neverthrow"],
  problem:
    "Nothing in a signature says which of the forty functions below it can throw, so error handling is guesswork by inspection.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
