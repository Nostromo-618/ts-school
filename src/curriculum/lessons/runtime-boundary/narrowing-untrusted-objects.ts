import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "narrowing-untrusted-objects",
  title: "Inspecting an object you did not create",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 12,
  summary:
    "in, Object.hasOwn, and prototype-chain surprises. Why __proto__ and constructor deserve special handling before you touch anything else.",
  prerequisites: ["user-defined-type-guards", "in-operator-narrowing"],
  keywords: [
    "prototype pollution",
    "hasOwn",
    "in operator",
    "__proto__",
    "untrusted",
  ],
  problem:
    "'toString' in payload is true for every object ever created, which makes the obvious presence check useless as a validator.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
