import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-mocks-and-stubs",
  title: "Mocks that satisfy the interface",
  tier: "intermediate",
  track: "testing",
  order: 4,
  summary:
    "Structural typing means a fake only needs the parts you use — as long as the type says so rather than a cast.",
  prerequisites: ["structural-typing", "typed-fixtures-and-factories"],
  keywords: ["mock", "stub", "fake", "interface", "structural", "test double"],
  problem:
    "A mock cast to the full interface compiles today and silently misses the method added tomorrow.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
