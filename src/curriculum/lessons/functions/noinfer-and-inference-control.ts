import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "noinfer-and-inference-control",
  title: "Steering inference with NoInfer",
  tier: "advanced",
  track: "functions",
  order: 18,
  summary:
    "NoInfer<T> tells the checker not to take a candidate from a position — the fix for a default argument that widens the type you were narrowing.",
  prerequisites: ["generic-inference-internals"],
  keywords: ["NoInfer", "inference", "candidate", "default", "generic"],
  problem:
    "One extra argument silently widens T, so an API that validated its input yesterday accepts anything today.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
