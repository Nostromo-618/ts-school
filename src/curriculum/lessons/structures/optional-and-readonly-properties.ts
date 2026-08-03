import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "optional-and-readonly-properties",
  title: "Optional and readonly properties",
  tier: "beginner",
  track: "structures",
  order: 4,
  summary:
    "?: adds undefined and makes a property omittable; readonly stops reassignment. Neither does what its name suggests at runtime.",
  prerequisites: ["interfaces-intro", "null-and-undefined"],
  keywords: [
    "optional property",
    "readonly",
    "undefined",
    "partial",
    "mutation",
  ],
  problem:
    "A field that is sometimes absent and a field that is sometimes undefined are different bugs, and one syntax covers both.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
