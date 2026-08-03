import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "discriminated-payloads-and-versioning",
  title: "Evolving a wire format",
  tier: "advanced",
  track: "runtime-boundary",
  order: 15,
  summary:
    "Versioned message unions, forwards- and backwards-compatible shapes, and exhaustiveness checks that fail the build when a producer moves first.",
  prerequisites: ["exhaustiveness-checking", "parse-dont-validate"],
  keywords: ["versioning", "wire format", "message", "compatibility", "queue"],
  problem:
    "A queue holds messages written by three versions of the producer, and the consumer's type describes only the newest.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
