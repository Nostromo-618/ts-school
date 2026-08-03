import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "literal-types",
  title: "Literal types",
  tier: "beginner",
  track: "types",
  order: 5,
  summary:
    '"GET" is a type with exactly one value. Unions of literals replace magic strings with something the compiler and the editor both understand.',
  prerequisites: ["union-types"],
  keywords: [
    "literal type",
    "string literal",
    "magic string",
    "const",
    "autocomplete",
  ],
  problem:
    'A typo\'d method name — "POSt" — is a perfectly good string, so it fails at runtime against a route table rather than at the keystroke.',
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
