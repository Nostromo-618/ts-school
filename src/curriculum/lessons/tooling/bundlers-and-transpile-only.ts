import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "bundlers-and-transpile-only",
  title: "Who is actually checking your types?",
  tier: "advanced",
  track: "tooling",
  order: 19,
  summary:
    "esbuild, swc, Vite, and Node's type stripping all delete types without reading them. Where the real gate goes in a modern pipeline.",
  prerequisites: [
    "isolatedmodules-and-verbatimmodulesyntax",
    "running-typescript-in-node",
  ],
  keywords: [
    "esbuild",
    "swc",
    "vite",
    "transpile only",
    "type check",
    "pipeline",
  ],
  problem:
    "The build is fast because it never type-checked anything, and the only thing that did was the editor on one developer's machine.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
