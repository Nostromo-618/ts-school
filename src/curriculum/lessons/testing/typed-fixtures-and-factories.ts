import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typed-fixtures-and-factories",
  title: "Fixtures that cannot drift",
  tier: "beginner",
  track: "testing",
  order: 2,
  summary:
    "Builder functions typed against the real model, so adding a required field breaks the fixtures instead of the assertions.",
  prerequisites: ["typing-your-test-files", "interfaces-intro"],
  keywords: ["fixture", "factory", "builder", "test data", "Partial"],
  problem:
    "Test data typed as any means a model change is caught by nothing until the assertions start failing for the wrong reason.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
