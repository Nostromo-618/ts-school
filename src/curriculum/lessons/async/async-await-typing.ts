import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "async-await-typing",
  title: "async and await",
  tier: "beginner",
  track: "async",
  order: 2,
  summary:
    "An async function always returns a promise, await unwraps exactly one layer, and the return annotation you write is the one after wrapping.",
  prerequisites: ["promise-types"],
  keywords: ["async", "await", "return type", "unwrap", "Promise"],
  problem:
    "Annotating an async function's return type as User instead of Promise<User> is the first error every newcomer writes.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
