import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "optional-and-default-parameters",
  title: "Optional and default parameters",
  tier: "beginner",
  track: "functions",
  order: 2,
  summary:
    "x?: number, x = 5, and why they produce different types — one includes undefined and one does not.",
  prerequisites: ["typing-parameters-and-returns", "null-and-undefined"],
  keywords: [
    "optional parameter",
    "default value",
    "undefined",
    "arity",
    "signature",
  ],
  problem:
    "An options bag with five optional fields has thirty-two valid shapes, and JavaScript checks none of them.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
