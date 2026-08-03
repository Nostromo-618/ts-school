import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "incremental-builds",
  title: "Incremental builds",
  tier: "intermediate",
  track: "tooling",
  order: 16,
  summary:
    "incremental, tsbuildinfo, composite, and why the second build is fast — plus the cache invalidations that make it slow again.",
  prerequisites: ["tsc-cli", "module-resolution-explained"],
  keywords: ["incremental", "tsbuildinfo", "composite", "cache", "build"],
  problem:
    "A stale tsbuildinfo makes tsc report success on code it did not check, which is worse than being slow.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
