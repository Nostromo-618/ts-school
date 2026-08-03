import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "module-resolution-explained",
  title: "How an import is resolved",
  tier: "intermediate",
  track: "tooling",
  order: 13,
  summary:
    "node16, nodenext, and bundler; baseUrl and paths; why the resolution mode changes what an import even means.",
  prerequisites: ["package-json-exports-and-types", "tsc-cli"],
  keywords: [
    "moduleResolution",
    "nodenext",
    "bundler",
    "paths",
    "baseUrl",
    "resolution",
  ],
  problem:
    "Cannot find module for a package that is definitely installed is nearly always a resolution-mode mismatch, not a missing dependency.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
