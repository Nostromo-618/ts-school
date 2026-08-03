import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "commonjs-to-esm",
  title: "CommonJS to ESM",
  tier: "intermediate",
  track: "node-migration",
  order: 8,
  summary:
    'module: nodenext, "type": "module", mandatory file extensions in relative imports, and what happens to require along the way.',
  prerequisites: ["esm-imports-and-exports", "renaming-your-first-file"],
  keywords: ["commonjs", "esm", "nodenext", "type module", "extensions"],
  problem:
    "ERR_MODULE_NOT_FOUND for a file that plainly exists is the extension rule, and nothing in the message says so.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
