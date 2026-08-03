import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "declaration-emit",
  title: "Declaration emit",
  tier: "advanced",
  track: "tooling",
  order: 18,
  summary:
    "How .d.ts files are generated, why 'the inferred type cannot be named' happens, declaration maps, and the isolatedDeclarations shortcut.",
  prerequisites: ["project-references", "declaration-files-intro"],
  keywords: [
    "declaration",
    "d.ts",
    "isolatedDeclarations",
    "declaration map",
    "portability",
  ],
  problem:
    "A type that compiles fine cannot be written into a declaration file, and the error names a file you have never opened.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
