import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "parse-dont-validate",
  title: "Parse, don't validate",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 11,
  summary:
    "Return the narrowed value rather than a boolean, so the proof travels with the data and cannot be forgotten one caller later.",
  prerequisites: ["schema-validation-libraries", "discriminated-unions"],
  keywords: [
    "parse don't validate",
    "illegal states",
    "modelling",
    "narrowing",
    "design",
  ],
  problem:
    "isValid(input) checks the data and returns nothing about it, so the next line still handles a type that includes the invalid case.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
