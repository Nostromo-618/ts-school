import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "suppressions",
  title: "Suppressing an error honestly",
  tier: "intermediate",
  track: "tooling",
  order: 15,
  summary:
    "@ts-expect-error against @ts-ignore, why the first is nearly always right, and keeping suppressions from becoming permanent.",
  prerequisites: ["reading-type-errors", "eslint-with-typescript"],
  keywords: ["ts-expect-error", "ts-ignore", "suppression", "debt", "review"],
  problem:
    "@ts-ignore stays silent forever, including after the underlying problem is fixed and the suppression is hiding a new one.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
