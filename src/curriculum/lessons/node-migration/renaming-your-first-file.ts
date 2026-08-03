import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "renaming-your-first-file",
  title: "Renaming your first file",
  tier: "beginner",
  track: "node-migration",
  order: 7,
  summary:
    "A guided .js to .ts conversion: the errors you will see, in the order you will see them, and which to fix rather than silence.",
  prerequisites: ["allowjs-and-checkjs", "any-and-implicit-any"],
  keywords: ["rename", "conversion", "first file", "errors", "migration"],
  problem:
    "The first renamed file produces forty errors, most of them the same three problems, and it is hard to tell that from the output.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
