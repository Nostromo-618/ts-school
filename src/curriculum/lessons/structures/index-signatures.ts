import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "index-signatures",
  title: "Index signatures",
  tier: "intermediate",
  track: "structures",
  order: 10,
  summary:
    "[key: string]: T describes an open bag. What it buys, what it costs, and why Record and a mapped type are usually the better tool.",
  prerequisites: ["interfaces-intro", "type-aliases-intro"],
  keywords: ["index signature", "Record", "dictionary", "open shape", "key"],
  problem:
    "An index signature says every key exists, so a typo'd lookup type-checks and returns undefined.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
