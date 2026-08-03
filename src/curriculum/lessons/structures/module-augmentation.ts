import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "module-augmentation",
  title: "Augmenting another package's types",
  tier: "advanced",
  track: "structures",
  order: 24,
  summary:
    "declare module to add to a dependency's types, declare global for the runtime globals — done in a way that survives an upgrade.",
  prerequisites: ["declaration-merging", "namespaces-and-legacy-code"],
  keywords: [
    "module augmentation",
    "declare module",
    "declare global",
    "d.ts",
    "express",
  ],
  problem:
    "Attaching a user object to Express's Request is a five-line change that half of all Node codebases get subtly wrong.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
