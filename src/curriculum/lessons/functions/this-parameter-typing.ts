import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "this-parameter-typing",
  title: "Typing this",
  tier: "intermediate",
  track: "functions",
  order: 13,
  summary:
    "The fake first parameter that types the receiver, why arrow functions do not have one, and what noImplicitThis is protecting you from.",
  prerequisites: ["function-type-expressions"],
  keywords: ["this", "noImplicitThis", "receiver", "bind", "arrow function"],
  problem:
    "A method pulled off an object and passed as a callback loses its receiver, and JavaScript reports it as undefined is not a function.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
