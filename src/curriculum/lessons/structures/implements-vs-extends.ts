import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "implements-vs-extends",
  title: "implements against extends",
  tier: "intermediate",
  track: "structures",
  order: 13,
  summary:
    "implements checks a class against a shape without inheriting anything; extends inherits. Structural typing means you often need neither.",
  prerequisites: ["classes-intro", "interfaces-intro"],
  keywords: ["implements", "extends", "inheritance", "structural", "contract"],
  problem:
    "Developers arriving from nominal languages reach for implements to make a class assignable, which it never needed.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
