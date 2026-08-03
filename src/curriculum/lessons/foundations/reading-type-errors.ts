import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "reading-type-errors",
  title: "Reading a TypeScript error",
  tier: "beginner",
  track: "foundations",
  order: 7,
  summary: "How to read a forty-line assignability error: find the leaf of the message chain, read it bottom-up, and use the error code to search.",
  prerequisites: ["first-type-error"],
  keywords: ["error message", "ts2322", "ts2345", "diagnostics", "message chain"],
  problem: "The first line of a TypeScript error is the most abstract one, so reading top-down tells you the least useful thing first.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
