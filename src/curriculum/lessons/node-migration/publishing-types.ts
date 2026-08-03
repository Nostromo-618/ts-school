import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "publishing-types",
  title: "Publishing a typed package",
  tier: "advanced",
  track: "node-migration",
  order: 21,
  summary:
    "Declaration emit, declaration maps, the types condition per export, and checking the result with a tool rather than hope.",
  prerequisites: ["dual-package-hazard", "declaration-emit"],
  keywords: [
    "publishing",
    "declaration",
    "arethetypeswrong",
    "d.ts",
    "public api",
  ],
  problem:
    "A package's types are only correct in the configuration its author used, and consumers find out at install time.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
