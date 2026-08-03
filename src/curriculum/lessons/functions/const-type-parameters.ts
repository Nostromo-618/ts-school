import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "const-type-parameters",
  title: "const type parameters",
  tier: "advanced",
  track: "functions",
  order: 19,
  summary:
    "<const T> makes a call site behave as though the caller wrote as const — the way a library preserves literal types without asking its users to.",
  prerequisites: ["const-assertions", "generic-inference-internals"],
  keywords: [
    "const type parameter",
    "as const",
    "literal",
    "inference",
    "api design",
  ],
  problem:
    "Every user of your builder API has to remember as const, and the ones who forget get string instead of their route names.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
