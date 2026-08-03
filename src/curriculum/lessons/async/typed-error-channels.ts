import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typed-error-channels",
  title: "Typed error channels",
  tier: "advanced",
  track: "async",
  order: 16,
  summary:
    "Effect, neverthrow, and friends put the error type in the signature. What that buys, what it costs in interop, and how to decide.",
  prerequisites: [
    "discriminated-results-in-practice",
    "higher-order-generic-signatures",
  ],
  keywords: [
    "Effect",
    "neverthrow",
    "typed errors",
    "error channel",
    "interop",
  ],
  problem:
    "A typed-error library is all-or-nothing at a boundary, and half-adopted it produces two error models in one codebase.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
