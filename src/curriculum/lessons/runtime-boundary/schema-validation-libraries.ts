import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "schema-validation-libraries",
  title: "Schemas as the source of truth",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 9,
  summary:
    "Zod, Valibot, ArkType, TypeBox: declare the schema, infer the type from it. The direction of that arrow is what stops the two from drifting.",
  prerequisites: ["writing-a-validator-by-hand", "typeof-type-queries"],
  keywords: [
    "zod",
    "valibot",
    "schema",
    "infer",
    "validation",
    "standard schema",
  ],
  problem:
    "A hand-written interface and a hand-written validator describe the same shape twice, and only one of them gets updated.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
