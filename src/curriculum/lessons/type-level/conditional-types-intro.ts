import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "conditional-types-intro",
  title: "Conditional types",
  tier: "intermediate",
  track: "type-level",
  order: 7,
  summary:
    "T extends U ? X : Y is an if statement in the type system. Where it is genuinely the right tool, and where a union would have done.",
  prerequisites: ["generic-constraints", "utility-types-tour"],
  keywords: ["conditional type", "extends", "branch", "ternary", "generic"],
  problem:
    "A function whose return type depends on an argument's type needs either three overloads or one conditional type.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
