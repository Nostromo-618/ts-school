import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "optional-chaining-and-nullish",
  title: "Optional chaining and nullish coalescing",
  tier: "beginner",
  track: "types",
  order: 7,
  summary:
    "?. and ?? are runtime operators the type system understands: how each one changes the type of the expression around it.",
  prerequisites: ["null-and-undefined"],
  keywords: ["optional chaining", "nullish coalescing", "??", "?.", "defaults"],
  problem:
    "|| treats 0 and the empty string as missing, so a default quietly overrides a legitimate value.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
