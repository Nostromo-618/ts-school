import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "unique-symbol",
  title: "unique symbol",
  tier: "advanced",
  track: "types",
  order: 23,
  summary:
    "The one place TypeScript gives a value its own identity in the type system, and the foundation of every branding trick that follows.",
  prerequisites: ["primitive-types", "const-assertions"],
  keywords: ["unique symbol", "symbol", "nominal", "identity", "declare const"],
  problem:
    "Structural typing has no notion of identity, so two types meant to be incompatible are interchangeable unless something breaks the tie.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
