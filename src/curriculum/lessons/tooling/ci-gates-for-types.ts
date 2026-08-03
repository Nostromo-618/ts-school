import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "ci-gates-for-types",
  title: "Type checking in CI",
  tier: "advanced",
  track: "tooling",
  order: 21,
  summary:
    "Where the check belongs in a pipeline, caching it, and ratcheting an error budget so a partially migrated codebase can only improve.",
  prerequisites: ["type-checking-performance", "suppressions"],
  keywords: ["ci", "gate", "ratchet", "error budget", "cache", "pipeline"],
  problem:
    "A codebase with 400 known errors either blocks every pull request or checks nothing, unless the gate counts rather than passes.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
