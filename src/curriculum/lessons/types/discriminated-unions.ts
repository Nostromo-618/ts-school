import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "discriminated-unions",
  title: "Discriminated unions",
  tier: "intermediate",
  track: "types",
  order: 12,
  summary:
    "Give every member of a union a literal tag and the checker can tell them apart. This is the single most useful modelling pattern in TypeScript.",
  prerequisites: ["equality-narrowing", "object-type-literals"],
  keywords: [
    "discriminated union",
    "tagged union",
    "kind",
    "variant",
    "state machine",
  ],
  problem:
    "A result object with optional data and optional error lets you construct the impossible state where both are present.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
