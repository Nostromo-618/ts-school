import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "accessors-and-computed-members",
  title: "Accessors and computed members",
  tier: "intermediate",
  track: "structures",
  order: 16,
  summary:
    "get and set with different types, computed property names, and how the checker treats a getter-only property as readonly.",
  prerequisites: ["classes-intro", "readonly-and-immutability"],
  keywords: ["getter", "setter", "accessor", "computed property", "readonly"],
  problem:
    "A setter that accepts a string and a getter that returns a Date is a useful API and an awkward one to type.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
