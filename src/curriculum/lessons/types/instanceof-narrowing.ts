import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "instanceof-narrowing",
  title: "Narrowing with instanceof",
  tier: "intermediate",
  track: "types",
  order: 15,
  summary:
    "instanceof narrows to a class, and does it by prototype chain — which is why it fails across realms and after transpiled subclassing.",
  prerequisites: ["narrowing-with-typeof"],
  keywords: ["instanceof", "prototype", "class", "narrowing", "realm"],
  problem:
    "instanceof Error is the standard way to inspect a caught value, and it silently stops working across a worker or vm boundary.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
