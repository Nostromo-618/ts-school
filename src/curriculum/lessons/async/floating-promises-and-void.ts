import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "floating-promises-and-void",
  title: "Floating promises",
  tier: "advanced",
  track: "async",
  order: 15,
  summary:
    "An un-awaited promise is a lost rejection and, since Node 15, a crashed process. How the checker and the linter find them, and what void is for.",
  prerequisites: ["void-returning-callbacks", "async-await-typing"],
  keywords: [
    "floating promise",
    "no-floating-promises",
    "void operator",
    "unhandled rejection",
  ],
  problem:
    "Forgetting one await turns an error path into an unhandled rejection that takes the whole process down.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
