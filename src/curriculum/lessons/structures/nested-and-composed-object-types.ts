import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "nested-and-composed-object-types",
  title: "Composing object types",
  tier: "beginner",
  track: "structures",
  order: 5,
  summary:
    "Building a big shape out of small named ones, and why a deeply nested inline type is unreadable in exactly the place it matters — the error message.",
  prerequisites: ["interfaces-intro"],
  keywords: ["composition", "nested", "reuse", "modelling", "domain"],
  problem:
    "One 60-line inline type in a handler signature is how a domain model hides from the people maintaining it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
