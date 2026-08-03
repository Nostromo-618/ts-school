import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-checking-performance",
  title: "When the checker gets slow",
  tier: "advanced",
  track: "tooling",
  order: 20,
  summary:
    "--diagnostics, --generateTrace, and the analyser: finding the type, the file, or the dependency that is costing you thirty seconds.",
  prerequisites: ["type-level-performance", "incremental-builds"],
  keywords: [
    "performance",
    "generateTrace",
    "diagnostics",
    "slow",
    "profiling",
  ],
  problem:
    "Compile times grow gradually until the editor is unusable, and by then nobody knows which change caused it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
