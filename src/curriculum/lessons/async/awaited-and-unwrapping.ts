import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "awaited-and-unwrapping",
  title: "Awaited and nested promises",
  tier: "intermediate",
  track: "async",
  order: 4,
  summary:
    "Awaited<T> flattens as far as await would. Where nested promises come from and why the naive unwrap type is wrong.",
  prerequisites: ["async-await-typing", "function-utility-types"],
  keywords: ["Awaited", "thenable", "unwrap", "nested promise", "utility type"],
  problem:
    "A cache that stores promises hands back Promise<Promise<T>> and the type that describes it has to flatten recursively.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
