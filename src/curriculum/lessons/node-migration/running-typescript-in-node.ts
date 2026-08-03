import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "running-typescript-in-node",
  title: "Actually running the thing",
  tier: "beginner",
  track: "node-migration",
  order: 6,
  summary:
    "tsc then node, tsx, ts-node, and Node's own type stripping. What each does to your source, and which ones type-check at all.",
  prerequisites: [
    "types-are-erased",
    "adding-typescript-to-an-existing-project",
  ],
  keywords: ["tsx", "ts-node", "type stripping", "run", "watch", "swc"],
  problem:
    "The fastest ways to run TypeScript do not type-check it, so a green dev server proves nothing about the build.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
