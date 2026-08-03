import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "types-are-erased",
  title: "Types are erased",
  tier: "beginner",
  track: "foundations",
  order: 3,
  summary: "Every annotation you write disappears before Node sees the file. What that buys you, and the one assumption it stops you from making.",
  prerequisites: ["first-type-error"],
  keywords: ["erasure", "compile time", "runtime", "emit", "no runtime cost"],
  problem: "Newcomers assume a type annotation validates data at runtime; it does not, and a wrong assumption there is how untrusted input walks straight in.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
