import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "call-and-construct-signatures",
  title: "Callable and constructable types",
  tier: "intermediate",
  track: "functions",
  order: 14,
  summary:
    "Objects that are also functions, and types that describe a class rather than its instances: (…): T and new (…): T.",
  prerequisites: ["function-type-expressions", "interfaces-intro"],
  keywords: [
    "call signature",
    "construct signature",
    "new",
    "callable",
    "factory",
  ],
  problem:
    "A factory that takes a class and returns instances of it cannot be typed with a plain function type.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
