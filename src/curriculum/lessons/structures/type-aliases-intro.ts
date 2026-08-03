import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-aliases-intro",
  title: "Type aliases",
  tier: "beginner",
  track: "structures",
  order: 2,
  summary:
    "type gives a name to any type at all — a union, a function, a tuple, a primitive — not just an object shape.",
  prerequisites: ["union-types", "object-type-literals"],
  keywords: ["type alias", "named type", "union", "alias", "type keyword"],
  problem:
    "Unions and function types have no interface form, so half your named types have nowhere to live without aliases.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
