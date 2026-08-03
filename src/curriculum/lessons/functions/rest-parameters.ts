import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "rest-parameters",
  title: "Rest parameters and spread",
  tier: "beginner",
  track: "functions",
  order: 3,
  summary:
    "Typing ...args, spreading a tuple into a call, and keeping the arity check the moment the argument list stops being homogeneous.",
  prerequisites: ["arrays-and-tuples", "typing-parameters-and-returns"],
  keywords: ["rest", "spread", "variadic", "tuple", "arguments"],
  problem:
    "...args typed as any[] gives up on every call site at once, which is the usual price of a variadic helper.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
