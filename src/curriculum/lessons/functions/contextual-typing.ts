import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "contextual-typing",
  title: "Contextual typing",
  tier: "beginner",
  track: "functions",
  order: 5,
  summary:
    "Why the parameters of an inline arrow function need no annotation: the type flows in from the position the function is written in.",
  prerequisites: ["function-type-expressions"],
  keywords: [
    "contextual typing",
    "inference",
    "inline callback",
    "arrow function",
  ],
  problem:
    "Annotating every callback parameter is noise, and extracting the callback to a variable is what makes the annotations suddenly necessary.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
