import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "testing-declaration-files",
  title: "Testing a package's public types",
  tier: "advanced",
  track: "testing",
  order: 12,
  summary:
    "Checking the emitted .d.ts rather than the source: resolution under each module mode, and what consumers actually see.",
  prerequisites: ["publishing-types", "type-level-tests"],
  keywords: ["d.ts", "public api", "arethetypeswrong", "resolution", "package"],
  problem:
    "The types you tested are the source's; the types you shipped are the emitted ones, and they are not always the same.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
