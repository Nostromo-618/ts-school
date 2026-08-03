import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "inferring-type-arguments",
  title: "Where type arguments come from",
  tier: "intermediate",
  track: "functions",
  order: 9,
  summary:
    "Inference reads the arguments you passed. When it guesses well, when it guesses too wide, and when to write the type argument out by hand.",
  prerequisites: ["generic-constraints", "inference-and-widening"],
  keywords: ["inference", "type argument", "explicit", "candidate", "widening"],
  problem:
    'The inferred T is string when you needed "GET" | "POST", and nothing in the error mentions inference at all.',
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
