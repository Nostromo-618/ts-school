import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "generic-utility-functions",
  title: "Writing generic helpers",
  tier: "intermediate",
  track: "functions",
  order: 11,
  summary:
    "pluck, groupBy, keyBy — the small utilities every Node codebase reinvents, typed so they return something more useful than any.",
  prerequisites: ["generic-constraints", "inferring-type-arguments"],
  keywords: ["utility", "pluck", "groupBy", "keyof", "generic", "lodash"],
  problem:
    "The hand-rolled groupBy at the bottom of utils.js returns an object of arrays of anything, forever.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
