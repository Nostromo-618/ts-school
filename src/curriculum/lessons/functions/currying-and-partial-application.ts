import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "currying-and-partial-application",
  title: "Keeping inference through composition",
  tier: "intermediate",
  track: "functions",
  order: 15,
  summary:
    "Curried functions, pipelines, and middleware chains all lose type information at the joins unless the signatures are written to carry it through.",
  prerequisites: ["generic-utility-functions", "inferring-type-arguments"],
  keywords: ["curry", "compose", "pipeline", "middleware", "inference"],
  problem:
    "compose(a, b, c) is where every functional Node codebase discovers the limits of inference.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
