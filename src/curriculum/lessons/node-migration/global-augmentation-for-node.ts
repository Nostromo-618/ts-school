import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "global-augmentation-for-node",
  title: "Augmenting globals",
  tier: "intermediate",
  track: "node-migration",
  order: 19,
  summary:
    "declare global for globalThis, adding a user to Express's Request, and doing it in a .d.ts that does not accidentally become a module.",
  prerequisites: ["declaration-merging", "typing-http-servers"],
  keywords: [
    "declare global",
    "globalThis",
    "Express.Request",
    "d.ts",
    "augmentation",
  ],
  problem:
    "A declaration file with a single import stops being ambient, and every global augmentation in it silently stops applying.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
