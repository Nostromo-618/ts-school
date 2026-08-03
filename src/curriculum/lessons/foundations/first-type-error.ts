import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "first-type-error",
  title: "Your first type error",
  tier: "beginner",
  track: "foundations",
  order: 2,
  summary: "Point tsc at a JavaScript file you already have, watch it disagree with you, and learn the shortest loop between writing a line and being told it is wrong.",
  prerequisites: ["why-types"],
  keywords: ["tsc", "cli", "noEmit", "checkJs", "first error"],
  problem: "Nothing tells you a file is wrong until it runs, and in a Node service 'runs' can mean 'in production, at 3am'.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
