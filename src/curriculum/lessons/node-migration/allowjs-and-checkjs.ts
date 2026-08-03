import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "allowjs-and-checkjs",
  title: "allowJs and checkJs",
  tier: "beginner",
  track: "node-migration",
  order: 3,
  summary:
    "Turn the checker on over the JavaScript you already have. What it finds on day one, and how to keep the noise survivable.",
  prerequisites: [
    "adding-typescript-to-an-existing-project",
    "any-and-implicit-any",
  ],
  keywords: ["allowJs", "checkJs", "@ts-check", "incremental", "jsdoc"],
  problem:
    "Waiting until files are renamed means getting nothing from TypeScript until the migration is finished.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
