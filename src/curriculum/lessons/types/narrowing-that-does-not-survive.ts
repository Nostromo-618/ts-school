import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "narrowing-that-does-not-survive",
  title: "Where narrowing is thrown away",
  tier: "advanced",
  track: "types",
  order: 22,
  summary:
    "Callbacks, closures, mutable properties, and any function call can reset a narrowed type. Which ones do, and what to do instead.",
  prerequisites: ["control-flow-analysis"],
  keywords: ["narrowing", "closure", "mutation", "callback", "invalidation"],
  problem:
    "The value is definitely not null on line 4 and possibly null again on line 6, and the only thing between them is a callback.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
