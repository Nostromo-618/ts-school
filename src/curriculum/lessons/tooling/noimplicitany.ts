import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "noimplicitany",
  title: "noImplicitAny",
  tier: "intermediate",
  track: "tooling",
  order: 5,
  summary:
    "The first rung: make the checker complain when it had to guess. Usually the biggest single error count and the biggest single payoff.",
  prerequisites: ["the-strictness-ladder", "any-and-implicit-any"],
  keywords: ["noImplicitAny", "implicit any", "parameters", "strict", "flag"],
  problem:
    "Without it, every unannotated parameter is any, and a file can be fully typed on paper and unchecked in practice.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
