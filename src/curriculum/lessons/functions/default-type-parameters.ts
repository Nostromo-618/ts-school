import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "default-type-parameters",
  title: "Default type parameters",
  tier: "intermediate",
  track: "functions",
  order: 10,
  summary:
    "T = unknown gives a generic a sensible zero value, which is how a library stays usable without every call site spelling out its types.",
  prerequisites: ["generic-constraints"],
  keywords: [
    "default type parameter",
    "generic default",
    "api design",
    "unknown",
  ],
  problem:
    "Adding a type parameter to a published type is a breaking change unless it has a default.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
