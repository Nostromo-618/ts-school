import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "primitive-types",
  title: "The primitives, and their impostors",
  tier: "beginner",
  track: "types",
  order: 1,
  summary:
    "string, number, boolean, null, undefined, symbol, bigint — and why String with a capital S is a different type that will bite you.",
  prerequisites: ["annotations-vs-inference"],
  keywords: [
    "string",
    "number",
    "boolean",
    "bigint",
    "symbol",
    "wrapper object",
  ],
  problem:
    "JavaScript has one number type and seven falsy values, and a codebase that never says which it means ends up with '1' + 1 in production.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
