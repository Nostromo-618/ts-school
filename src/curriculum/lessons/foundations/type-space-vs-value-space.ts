import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-space-vs-value-space",
  title: "Type space against value space",
  tier: "intermediate",
  track: "foundations",
  order: 13,
  summary: "The same identifier can name a value, a type, or both. Which declarations create which, and how typeof and keyof cross between the two worlds.",
  prerequisites: ["structural-typing", "types-are-erased"],
  keywords: ["type space", "value space", "typeof", "declaration merging", "namespace"],
  problem: "Cannot find name X — used as a value — appears when you reference a type where a value was needed, and the message never says which space it looked in.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
