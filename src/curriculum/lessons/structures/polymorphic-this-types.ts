import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "polymorphic-this-types",
  title: "Polymorphic this",
  tier: "advanced",
  track: "structures",
  order: 21,
  summary:
    "A method that returns this keeps the subclass's type through a chain — the mechanism behind every fluent builder that survives inheritance.",
  prerequisites: ["abstract-classes", "generic-classes-and-interfaces"],
  keywords: ["this type", "fluent", "builder", "chaining", "subclass"],
  problem:
    "A builder method typed to return the base class truncates the chain the moment someone subclasses it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
