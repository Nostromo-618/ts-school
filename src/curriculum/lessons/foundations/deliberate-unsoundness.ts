import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "deliberate-unsoundness",
  title: "Where TypeScript is unsound on purpose",
  tier: "advanced",
  track: "foundations",
  order: 17,
  summary: "Method parameter bivariance, array covariance, assertions, and any. Each hole is a deliberate trade for usability — knowing which is which is the point.",
  prerequisites: ["structural-typing", "type-space-vs-value-space"],
  keywords: ["soundness", "bivariance", "covariance", "assertion", "trade-off"],
  problem: "A type-checked program can still throw a TypeError, and believing otherwise is how the checked parts stop being reviewed.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
