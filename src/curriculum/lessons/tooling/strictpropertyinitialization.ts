import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "strictpropertyinitialization",
  title: "strictPropertyInitialization",
  tier: "intermediate",
  track: "tooling",
  order: 8,
  summary:
    "Class fields must be assigned by the end of the constructor. What that catches, and the three legitimate escape hatches.",
  prerequisites: ["the-strictness-ladder", "classes-intro"],
  keywords: [
    "strictPropertyInitialization",
    "class",
    "field",
    "definite assignment",
    "constructor",
  ],
  problem:
    "A field initialised in an async init method is undefined for every call that arrives before it, and the type says otherwise.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
