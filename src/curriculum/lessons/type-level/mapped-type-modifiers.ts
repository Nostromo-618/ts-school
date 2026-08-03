import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "mapped-type-modifiers",
  title: "Modifiers on mapped types",
  tier: "advanced",
  track: "type-level",
  order: 12,
  summary:
    "+? and -? , +readonly and -readonly. Adding optionality is easy; removing it is the trick behind Required and every Mutable helper.",
  prerequisites: ["mapped-types-intro", "optional-and-readonly-properties"],
  keywords: [
    "mapped type",
    "modifier",
    "Required",
    "Mutable",
    "readonly",
    "optional",
  ],
  problem:
    "Making every field required again after Partial has been applied is not expressible without modifier removal.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
