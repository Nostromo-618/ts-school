import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "promise-types",
  title: "Promise<T>",
  tier: "beginner",
  track: "async",
  order: 1,
  summary:
    "A promise is generic over what it resolves to and says nothing at all about what it rejects with. That asymmetry shapes every lesson in this track.",
  prerequisites: ["function-type-expressions", "object-type-literals"],
  keywords: ["Promise", "generic", "resolve", "reject", "then"],
  problem:
    "Promise<User> promises a user on success and gives you no vocabulary whatsoever for the failure case.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
