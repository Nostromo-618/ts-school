import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "template-literal-types-intro",
  title: "Template literal types",
  tier: "intermediate",
  track: "type-level",
  order: 9,
  summary:
    "`on${Capitalize<E>}` builds string types from other string types — event names, CSS properties, route paths, all checked.",
  prerequisites: ["literal-types", "mapped-types-intro"],
  keywords: [
    "template literal type",
    "Capitalize",
    "string type",
    "event",
    "route",
  ],
  problem:
    "Event names built by string concatenation at runtime are opaque to the checker, so a listener for a name nobody emits is silent.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
