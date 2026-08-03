import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-cli-arguments",
  title: "Command-line arguments",
  tier: "intermediate",
  track: "node-migration",
  order: 13,
  summary:
    "process.argv, node:util parseArgs, and how a typed options object beats an argument parser that returns a record of any.",
  prerequisites: ["typing-process-env"],
  keywords: ["argv", "parseArgs", "cli", "commander", "options"],
  problem:
    "Argument parsers return a bag of loosely typed values, so the flags your program supports exist only in the help text.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
