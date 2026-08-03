import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "erasable-syntax-and-type-stripping",
  title: "Erasable syntax and native type stripping",
  tier: "intermediate",
  track: "foundations",
  order: 15,
  summary: "Node can now run .ts files by deleting the types. What that rules out — enums, parameter properties, namespaces — and why erasableSyntaxOnly exists.",
  prerequisites: ["types-are-erased", "tsconfig-essentials"],
  keywords: ["type stripping", "erasableSyntaxOnly", "node", "enum", "no build", "amaro"],
  problem: "Some TypeScript syntax emits real JavaScript, so a file using it cannot be run by simply deleting the types.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
