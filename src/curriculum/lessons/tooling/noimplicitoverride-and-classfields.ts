import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "noimplicitoverride-and-classfields",
  title: "noImplicitOverride and useDefineForClassFields",
  tier: "intermediate",
  track: "tooling",
  order: 11,
  summary:
    "Two class-shaped flags: one makes overriding explicit, the other changes what a field declaration actually emits.",
  prerequisites: ["abstract-classes", "the-strictness-ladder"],
  keywords: [
    "noImplicitOverride",
    "useDefineForClassFields",
    "override",
    "class fields",
    "emit",
  ],
  problem:
    "Renaming a base-class method leaves the subclass with a method that overrides nothing and is never called.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
