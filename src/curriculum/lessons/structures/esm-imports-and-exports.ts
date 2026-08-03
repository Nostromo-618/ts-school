import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "esm-imports-and-exports",
  title: "Modules, imports, and type-only imports",
  tier: "beginner",
  track: "structures",
  order: 9,
  summary:
    "Named and default exports, import type, and why a type import that looks like a value import can change what ends up in your bundle.",
  prerequisites: ["types-are-erased"],
  keywords: ["esm", "import", "export", "import type", "side effect"],
  problem:
    "Importing a type from a module that has side effects keeps the module in the output even though nothing uses it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
