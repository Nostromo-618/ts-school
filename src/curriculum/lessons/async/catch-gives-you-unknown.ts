import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "catch-gives-you-unknown",
  title: "catch gives you unknown",
  tier: "intermediate",
  track: "async",
  order: 5,
  summary:
    "JavaScript lets you throw anything, so a caught value is unknown under useUnknownInCatchVariables. What to do with it before assuming it is an Error.",
  prerequisites: ["unknown-vs-any", "async-await-typing"],
  keywords: [
    "catch",
    "unknown",
    "useUnknownInCatchVariables",
    "error",
    "throw",
  ],
  problem:
    "err.message on a caught value crashes with a different error whenever something threw a string.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
