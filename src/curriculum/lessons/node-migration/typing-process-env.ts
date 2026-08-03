import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-process-env",
  title: "process.env is not a config object",
  tier: "intermediate",
  track: "node-migration",
  order: 12,
  summary:
    "Every variable is string | undefined. Parsing environment into a validated config object once, at startup, instead of reading it forty times.",
  prerequisites: ["schema-validation-libraries", "node-builtin-modules"],
  keywords: ["process.env", "config", "environment", "validation", "12 factor"],
  problem:
    'A missing environment variable becomes undefined, then "undefined" in a URL, and the failure surfaces as a 404 from an upstream service.',
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
