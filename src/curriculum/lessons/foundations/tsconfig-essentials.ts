import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "tsconfig-essentials",
  title: "tsconfig.json: the options that matter first",
  tier: "beginner",
  track: "foundations",
  order: 10,
  summary: "A tsconfig for a Node service, option by option: target, module, moduleResolution, lib, outDir, rootDir, strict, and skipLibCheck.",
  prerequisites: ["strict-mode"],
  keywords: ["tsconfig", "target", "module", "lib", "outDir", "configuration"],
  problem: "Copying a tsconfig from a blog post produces errors that make no sense, because half its options were written for a different runtime.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
