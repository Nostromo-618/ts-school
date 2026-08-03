import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "generic-inference-internals",
  title: "How inference picks a type argument",
  tier: "advanced",
  track: "functions",
  order: 17,
  summary:
    "Inference sites, candidate collection, priorities, and the common supertype rule. Enough of the algorithm to predict what T will be.",
  prerequisites: ["inferring-type-arguments", "assignability-rules"],
  keywords: ["inference", "candidate", "priority", "supertype", "generic"],
  problem:
    "Reordering two parameters changes the inferred type, and nothing in the signature says it should.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
