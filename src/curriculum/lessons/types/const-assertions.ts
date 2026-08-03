import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "const-assertions",
  title: "as const",
  tier: "intermediate",
  track: "types",
  order: 17,
  summary:
    "A const assertion freezes an object or array into its most specific readonly literal type — the cheapest way to build a lookup table the checker understands.",
  prerequisites: ["literal-types", "inference-and-widening"],
  keywords: ["as const", "const assertion", "readonly", "literal", "widening"],
  problem:
    "A config object's values widen to string the moment it is declared, so nothing downstream can depend on what is actually in it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
