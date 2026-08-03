import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-assertions-are-claims",
  title: "as is a claim, not a check",
  tier: "beginner",
  track: "runtime-boundary",
  order: 4,
  summary:
    "A type assertion tells the compiler to stop asking. Where that is legitimate, where it is a lie, and why the two look identical in a diff.",
  prerequisites: ["json-parse-returns-any"],
  keywords: ["as", "type assertion", "cast", "unsound", "trust"],
  problem:
    "JSON.parse(body) as User compiles, reads like validation, and validates nothing whatsoever.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
