import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typescript-versions-and-the-go-port",
  title: "TypeScript 6, 7, and the Go port",
  tier: "advanced",
  track: "tooling",
  order: 22,
  summary:
    "What the native port changes, what it removes — including the programmatic API this very site runs in a Web Worker — and how to plan for it.",
  prerequisites: ["tsc-compiler-pipeline", "bundlers-and-transpile-only"],
  keywords: [
    "typescript 7",
    "go",
    "native",
    "compiler api",
    "tsgo",
    "migration",
  ],
  problem:
    "TypeScript 7 is a native binary with no JavaScript API, so every tool built on the compiler has to wait for a new one.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
