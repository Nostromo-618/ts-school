import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "function-type-expressions",
  title: "Typing a callback",
  tier: "beginner",
  track: "functions",
  order: 4,
  summary:
    "(value: string) => void as a parameter type, the difference between a function type and a method signature, and where each is appropriate.",
  prerequisites: ["typing-parameters-and-returns"],
  keywords: [
    "callback",
    "function type",
    "higher order",
    "handler",
    "signature",
  ],
  problem:
    "Every Node API takes a callback, and an untyped one turns its parameters into any all the way down.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
