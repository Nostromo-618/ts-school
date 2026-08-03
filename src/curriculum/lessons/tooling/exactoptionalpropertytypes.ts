import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "exactoptionalpropertytypes",
  title: "exactOptionalPropertyTypes",
  tier: "intermediate",
  track: "tooling",
  order: 10,
  summary:
    "Distinguishes an absent property from one explicitly set to undefined. Correct, occasionally infuriating, and worth understanding before you enable it.",
  prerequisites: ["optional-and-readonly-properties", "the-strictness-ladder"],
  keywords: [
    "exactOptionalPropertyTypes",
    "optional",
    "undefined",
    "absent",
    "patch",
  ],
  problem:
    "A PATCH body where a field is missing means leave it alone, and where it is null means clear it — and one type covers both.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
