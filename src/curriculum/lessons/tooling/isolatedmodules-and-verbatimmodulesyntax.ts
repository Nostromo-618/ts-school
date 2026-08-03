import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "isolatedmodules-and-verbatimmodulesyntax",
  title: "isolatedModules and verbatimModuleSyntax",
  tier: "intermediate",
  track: "tooling",
  order: 12,
  summary:
    "What single-file transpilers cannot know, why import type exists, and how these flags keep tsc and esbuild agreeing.",
  prerequisites: ["esm-imports-and-exports", "running-typescript-in-node"],
  keywords: [
    "isolatedModules",
    "verbatimModuleSyntax",
    "import type",
    "transpile",
    "esbuild",
  ],
  problem:
    "A re-exported type compiles under tsc and produces a runtime import of something that does not exist under esbuild.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
