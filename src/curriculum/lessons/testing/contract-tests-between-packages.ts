import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "contract-tests-between-packages",
  title: "Catching a breaking type change",
  tier: "advanced",
  track: "testing",
  order: 13,
  summary:
    "Type-level contract tests in CI, API-surface snapshots, and turning an accidental breaking change into a failed build rather than a consumer's bug report.",
  prerequisites: ["testing-declaration-files", "ci-gates-for-types"],
  keywords: ["contract test", "api surface", "breaking change", "semver", "ci"],
  problem:
    "Semver says a type change is breaking, and nothing in the release process can tell whether one happened.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
