import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "function-utility-types",
  title: "Utility types for functions",
  tier: "intermediate",
  track: "type-level",
  order: 5,
  summary:
    "ReturnType, Parameters, ConstructorParameters, ThisParameterType, Awaited — deriving types from a signature you already have.",
  prerequisites: ["utility-types-tour", "function-type-expressions"],
  keywords: ["ReturnType", "Parameters", "Awaited", "signature", "derive"],
  problem:
    "A wrapper around someone else's function restates its argument list, and the restatement is wrong within a release.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
