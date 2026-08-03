import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "annotations-vs-inference",
  title: "Annotations against inference",
  tier: "beginner",
  track: "foundations",
  order: 4,
  summary:
    "TypeScript already knows the type of most expressions. Where writing the type down helps a reader, and where it just gives you something to keep in sync.",
  prerequisites: ["first-type-error"],
  keywords: [
    "annotation",
    "inference",
    "explicit types",
    "style",
    "readability",
  ],
  problem:
    "Annotating everything is noise and annotating nothing loses the contract at the edges of a module; neither extreme is the answer.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
