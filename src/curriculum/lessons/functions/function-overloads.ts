import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "function-overloads",
  title: "Overloads",
  tier: "intermediate",
  track: "functions",
  order: 12,
  summary:
    "Several signatures over one implementation, when the return type depends on the arguments — and the union or generic that is usually better.",
  prerequisites: ["generics-intro", "function-type-expressions"],
  keywords: [
    "overload",
    "signature",
    "implementation signature",
    "union",
    "api design",
  ],
  problem:
    "readFile returns a Buffer or a string depending on an options field, and one signature cannot say that honestly.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
