import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "null-and-undefined",
  title: "null and undefined",
  tier: "beginner",
  track: "types",
  order: 6,
  summary:
    "The two absences JavaScript ships with, what strictNullChecks changes about them, and why 'cannot read properties of undefined' stops being a surprise.",
  prerequisites: ["union-types", "strict-mode"],
  keywords: ["null", "undefined", "strictNullChecks", "optional", "absence"],
  problem:
    "Without strictNullChecks every type silently includes null and undefined, so the most common runtime crash in Node is invisible to the checker.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
