import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-parameters-and-returns",
  title: "Parameters and return types",
  tier: "beginner",
  track: "functions",
  order: 1,
  summary:
    "The smallest useful annotation in any codebase: what goes in and what comes out. Where to write the return type and where to let it be inferred.",
  prerequisites: ["annotations-vs-inference", "object-type-literals"],
  keywords: ["parameter", "return type", "signature", "annotation", "function"],
  problem:
    "A function's contract lives in the heads of the people who wrote its callers, and they have all moved teams.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
