import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "inference-and-widening",
  title: "Inference and widening",
  tier: "beginner",
  track: "foundations",
  order: 5,
  summary: "Why const x = \"GET\" is the literal type \"GET\" but let x = \"GET\" is string, and why that difference decides whether your config object still fits its parameter.",
  prerequisites: ["annotations-vs-inference"],
  keywords: ["widening", "literal type", "const", "let", "inference"],
  problem: "A value that was specific enough a line ago is suddenly just string, and the error appears at the call site rather than where the type was lost.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
