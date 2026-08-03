import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "deserialization-attack-surface",
  title: "Deserialization as an attack surface",
  tier: "advanced",
  track: "runtime-boundary",
  order: 16,
  summary:
    "Prototype pollution, JSON.parse revivers, structuredClone, and merge helpers — the places where parsing untrusted data changes your program rather than describing it.",
  prerequisites: ["narrowing-untrusted-objects"],
  keywords: [
    "prototype pollution",
    "reviver",
    "structuredClone",
    "merge",
    "security",
  ],
  problem:
    "A deep-merge helper applied to a request body can rewrite Object.prototype for the whole process.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
