import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-only-vs-value-imports",
  title: "Type imports and what ends up in the bundle",
  tier: "intermediate",
  track: "tooling",
  order: 14,
  summary:
    "import type, inline type specifiers, side-effect imports, and importsNotUsedAsValues' successor — controlling exactly what survives compilation.",
  prerequisites: ["isolatedmodules-and-verbatimmodulesyntax"],
  keywords: ["import type", "side effect", "elision", "bundle", "tree shaking"],
  problem:
    "An import used only as a type is usually erased, and the one time it is not, a server module ends up in a client bundle.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
