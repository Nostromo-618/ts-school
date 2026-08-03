import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "parameter-properties",
  title: "Parameter properties",
  tier: "intermediate",
  track: "structures",
  order: 15,
  summary:
    "constructor(private readonly db: Db) declares and assigns in one place — and emits real JavaScript, so it cannot be type-stripped.",
  prerequisites: [
    "class-member-visibility",
    "erasable-syntax-and-type-stripping",
  ],
  keywords: [
    "parameter property",
    "constructor",
    "shorthand",
    "erasable",
    "di",
  ],
  problem:
    "The most convenient class syntax in TypeScript is one of the few that Node's native type stripping refuses to run.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
