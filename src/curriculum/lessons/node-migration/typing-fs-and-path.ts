import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-fs-and-path",
  title: "fs and path",
  tier: "intermediate",
  track: "node-migration",
  order: 14,
  summary:
    "The three fs APIs, the overloads that switch between Buffer and string, and typed path handling that survives Windows.",
  prerequisites: ["node-builtin-modules", "function-overloads"],
  keywords: ["fs", "fs/promises", "path", "Buffer", "encoding", "overload"],
  problem:
    "readFile returns a Buffer or a string depending on an options argument, and forgetting the encoding gives you a Buffer where you wanted text.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
