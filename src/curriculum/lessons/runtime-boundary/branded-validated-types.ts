import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "branded-validated-types",
  title: "Types only a validator can mint",
  tier: "advanced",
  track: "runtime-boundary",
  order: 14,
  summary:
    "Brand the output of a parser so an Email can only be produced by the function that checked it — validation you cannot forget to call.",
  prerequisites: ["branded-and-nominal-types", "parse-dont-validate"],
  keywords: [
    "branded type",
    "smart constructor",
    "validation",
    "Email",
    "opaque",
  ],
  problem:
    "Validation happens at the edge and the value travels for another twenty functions, any of which may construct a fresh unvalidated one.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
