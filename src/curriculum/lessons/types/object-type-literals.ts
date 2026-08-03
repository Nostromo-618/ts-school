import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "object-type-literals",
  title: "Object types",
  tier: "beginner",
  track: "types",
  order: 3,
  summary:
    "Describing a shape inline: required and optional properties, nested objects, and how the checker compares two of them.",
  prerequisites: ["primitive-types", "structural-typing"],
  keywords: ["object type", "optional property", "shape", "property", "nested"],
  problem:
    "Every Node handler passes objects around, and without a shape written down the only documentation is the last person who read the code.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
