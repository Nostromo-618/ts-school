import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "equality-narrowing",
  title: "Narrowing by equality",
  tier: "beginner",
  track: "types",
  order: 10,
  summary:
    "===, !==, switch, and the double-equals-null idiom all narrow. This is the machinery behind every tagged union you will write later.",
  prerequisites: ["literal-types", "narrowing-with-typeof"],
  keywords: ["equality", "switch", "== null", "narrowing", "comparison"],
  problem:
    "Comparing against a literal proves something about the value, and JavaScript throws that proof away at the closing brace.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
