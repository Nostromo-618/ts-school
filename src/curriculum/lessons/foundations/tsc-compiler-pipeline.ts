import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "tsc-compiler-pipeline",
  title: "What tsc actually does",
  tier: "advanced",
  track: "foundations",
  order: 16,
  summary:
    "Scanner, parser, binder, checker, emitter — and where a Program, a SourceFile, and a TypeChecker sit. The same API this site runs in a Web Worker.",
  prerequisites: [
    "type-space-vs-value-space",
    "erasable-syntax-and-type-stripping",
  ],
  keywords: ["compiler", "binder", "checker", "program", "AST", "compiler api"],
  problem:
    "Treating the compiler as a black box makes its performance characteristics and its error messages equally mysterious.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
