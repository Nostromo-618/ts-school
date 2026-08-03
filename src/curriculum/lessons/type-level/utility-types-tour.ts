import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "utility-types-tour",
  title: "The built-in utility types",
  tier: "intermediate",
  track: "type-level",
  order: 4,
  summary:
    "Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable — what each one does and, more usefully, which one you actually meant.",
  prerequisites: ["indexed-access-types", "optional-and-readonly-properties"],
  keywords: ["Partial", "Pick", "Omit", "Record", "Exclude", "utility types"],
  problem:
    "Omit does not check that the key exists, so removing a field that was already renamed silently does nothing.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
