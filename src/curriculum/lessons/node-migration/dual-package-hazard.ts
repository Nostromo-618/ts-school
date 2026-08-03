import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "dual-package-hazard",
  title: "The dual-package hazard",
  tier: "advanced",
  track: "node-migration",
  order: 20,
  summary:
    "Shipping CommonJS and ESM builds means two copies of your module and two copies of its types. What breaks, and the conditions that avoid it.",
  prerequisites: ["package-json-exports-and-types"],
  keywords: ["dual package", "conditional exports", "cjs", "esm", "instanceof"],
  problem:
    "Two copies of the same class means instanceof fails between them, and the types compare as unrelated.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
