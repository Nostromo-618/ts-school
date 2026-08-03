import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "key-remapping-with-as",
  title: "Key remapping",
  tier: "advanced",
  track: "type-level",
  order: 13,
  summary:
    "as inside a mapped type renames or drops keys as it goes — getters from fields, prefixed events, filtered shapes.",
  prerequisites: ["mapped-types-intro", "template-literal-types-intro"],
  keywords: ["key remapping", "as clause", "mapped type", "rename", "filter"],
  problem:
    "Generating a getter interface from a model interface means renaming every key, and a mapped type could not do that at all until remapping arrived.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
