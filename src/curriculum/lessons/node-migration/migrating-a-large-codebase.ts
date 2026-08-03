import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "migrating-a-large-codebase",
  title: "Migrating something large",
  tier: "advanced",
  track: "node-migration",
  order: 23,
  summary:
    "Strangler boundaries, per-directory strictness, codemods, and a ratchet in CI so the error count can only go down.",
  prerequisites: ["renaming-your-first-file", "ci-gates-for-types"],
  keywords: [
    "migration",
    "strangler",
    "ratchet",
    "codemod",
    "strategy",
    "legacy",
  ],
  problem:
    "A migration that has to finish before it delivers value is a migration that gets cancelled at the halfway point.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
