import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "json-parse-returns-any",
  title: "JSON.parse returns any",
  tier: "beginner",
  track: "runtime-boundary",
  order: 3,
  summary:
    "The most common hole in a Node codebase. What the signature actually says, why it says it, and the one-line change that turns it into unknown.",
  prerequisites: ["unknown-vs-any"],
  keywords: ["JSON.parse", "any", "unknown", "deserialize", "request body"],
  problem:
    "const user = JSON.parse(body) type-checks perfectly and gives you an object of pure faith.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
