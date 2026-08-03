import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "structural-typing",
  title: "Structural typing: shape, not name",
  tier: "beginner",
  track: "foundations",
  order: 6,
  summary: "TypeScript compares types by what they contain, not by what they are called. This is the single idea that most surprises developers arriving from Java or C#.",
  prerequisites: ["annotations-vs-inference"],
  keywords: ["structural", "duck typing", "nominal", "assignability", "shape"],
  problem: "Two unrelated objects with matching fields are interchangeable, so a Metres value slots happily into a Feet parameter.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
