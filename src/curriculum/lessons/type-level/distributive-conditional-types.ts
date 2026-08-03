import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "distributive-conditional-types",
  title: "Distributive conditional types",
  tier: "advanced",
  track: "type-level",
  order: 11,
  summary:
    "A naked type parameter distributes over a union, which is why Exclude works — and why your conditional type sometimes returns a union you did not ask for.",
  prerequisites: ["infer-keyword", "union-types"],
  keywords: [
    "distributive",
    "conditional type",
    "union",
    "naked type parameter",
    "Exclude",
  ],
  problem:
    "The same conditional type returns a different answer for a union than for each of its members, and nothing in the syntax hints at it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
