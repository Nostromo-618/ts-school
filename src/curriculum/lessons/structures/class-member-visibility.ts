import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "class-member-visibility",
  title: "private, protected, and #private",
  tier: "beginner",
  track: "structures",
  order: 8,
  summary:
    "TypeScript's private is erased and enforced only at compile time; #private is a runtime feature. When that difference matters.",
  prerequisites: ["classes-intro"],
  keywords: ["private", "protected", "public", "hash private", "encapsulation"],
  problem:
    "A private field is fully readable from JavaScript, from JSON.stringify, and from any consumer who did not read your types.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
