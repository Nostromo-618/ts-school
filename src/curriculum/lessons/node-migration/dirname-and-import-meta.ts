import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "dirname-and-import-meta",
  title: "__dirname is gone",
  tier: "intermediate",
  track: "node-migration",
  order: 10,
  summary:
    "import.meta.url, import.meta.dirname, and fileURLToPath — replacing the CommonJS path globals without breaking either module system.",
  prerequisites: ["commonjs-to-esm"],
  keywords: ["__dirname", "import.meta", "fileURLToPath", "path", "esm"],
  problem:
    "Every file-reading helper in a Node codebase uses __dirname, and it does not exist in an ES module.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
