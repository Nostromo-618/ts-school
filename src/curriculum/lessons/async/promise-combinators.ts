import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "promise-combinators",
  title: "all, allSettled, race, any",
  tier: "intermediate",
  track: "async",
  order: 10,
  summary:
    "Promise.all preserves a tuple's element types, allSettled gives you a discriminated union per element, and race and any differ in how they fail.",
  prerequisites: ["promise-types", "arrays-and-tuples"],
  keywords: ["Promise.all", "allSettled", "race", "tuple", "AggregateError"],
  problem:
    "Promise.all over a heterogeneous array collapses to a union unless the argument is a tuple, and array literals are not tuples by default.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
