import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "static-members-and-static-blocks",
  title: "Static members",
  tier: "intermediate",
  track: "structures",
  order: 17,
  summary:
    "Statics, static blocks, and the type of the class itself — which is what you need when a function takes a class rather than an instance.",
  prerequisites: ["classes-intro", "call-and-construct-signatures"],
  keywords: ["static", "static block", "class type", "typeof class", "factory"],
  problem:
    "typeof MyClass and MyClass are different types, and the error message uses both words without distinguishing them.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
