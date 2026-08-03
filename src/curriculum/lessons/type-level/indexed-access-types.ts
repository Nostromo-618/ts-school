import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "indexed-access-types",
  title: "Indexed access types",
  tier: "intermediate",
  track: "type-level",
  order: 3,
  summary:
    'User["id"], Routes[keyof Routes], and array element types via T[number] — reading a type out of another type.',
  prerequisites: ["keyof-operator"],
  keywords: [
    "indexed access",
    "lookup type",
    "T[number]",
    "element type",
    "keyof",
  ],
  problem:
    "Duplicating a nested field's type gives you two declarations to keep in step and no error when they drift.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
