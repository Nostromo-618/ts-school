import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-javascript-with-jsdoc",
  title: "Typing JavaScript with JSDoc",
  tier: "intermediate",
  track: "foundations",
  order: 14,
  summary: "checkJs plus JSDoc annotations gives an existing .js codebase real checking with no build step and no file renames — the cheapest first move in a migration.",
  prerequisites: ["declaration-files-intro", "annotations-vs-inference"],
  keywords: ["jsdoc", "checkJs", "allowJs", "@type", "migration", "no build step"],
  problem: "A large Node codebase cannot be renamed to .ts in one commit, and until it is, nothing is checked at all.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
