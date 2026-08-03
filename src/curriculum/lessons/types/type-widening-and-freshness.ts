import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-widening-and-freshness",
  title: "Widening and freshness",
  tier: "intermediate",
  track: "types",
  order: 20,
  summary:
    "Why the same literal has one type in a const, another in a let, and a third when passed directly to a parameter — and how to control which you get.",
  prerequisites: ["const-assertions", "object-type-literals"],
  keywords: [
    "widening",
    "freshness",
    "literal type",
    "excess property",
    "inference",
  ],
  problem:
    "Extracting an object literal into a variable turns a compile error into silence, or silence into a compile error, with no other change.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
