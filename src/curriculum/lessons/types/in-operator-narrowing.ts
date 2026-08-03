import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "in-operator-narrowing",
  title: "Narrowing with in",
  tier: "intermediate",
  track: "types",
  order: 14,
  summary:
    "'id' in value narrows a union by property presence — useful when you do not own the shapes and cannot add a tag.",
  prerequisites: ["discriminated-unions"],
  keywords: ["in operator", "narrowing", "property presence", "duck typing"],
  problem:
    "Third-party union types rarely come with a discriminant, so branching on them needs a different proof.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
