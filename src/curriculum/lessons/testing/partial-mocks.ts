import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "partial-mocks",
  title: "Partial and deep-partial mocks",
  tier: "intermediate",
  track: "testing",
  order: 5,
  summary:
    "Partial<T> for the shallow case, a recursive helper for the deep one, and the single cast at the boundary that you should make deliberately and once.",
  prerequisites: ["typing-mocks-and-stubs", "utility-types-tour"],
  keywords: ["Partial", "DeepPartial", "mock", "cast", "recursive"],
  problem:
    "Mocking a client with thirty methods to test one of them means writing twenty-nine you will never call.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
