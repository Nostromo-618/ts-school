import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "namespaces-and-legacy-code",
  title: "Namespaces, and the code that still uses them",
  tier: "intermediate",
  track: "structures",
  order: 20,
  summary:
    "declare namespace is everywhere in older type definitions. How to read it, how to consume it, and why not to write new ones.",
  prerequisites: ["declaration-merging", "esm-imports-and-exports"],
  keywords: ["namespace", "module", "legacy", "declare", "DefinitelyTyped"],
  problem:
    "Half of DefinitelyTyped predates ES modules, so consuming it means understanding a module system you would never choose.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
