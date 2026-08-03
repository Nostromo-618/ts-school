import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "mocking-modules",
  title: "Typed module mocks",
  tier: "intermediate",
  track: "testing",
  order: 6,
  summary:
    "vi.mock and jest.mock erase types unless you help them. MockedFunction, mocked(), and keeping the mock's signature tied to the real one.",
  prerequisites: ["typing-mocks-and-stubs", "typeof-type-queries"],
  keywords: [
    "vi.mock",
    "jest.mock",
    "MockedFunction",
    "module mock",
    "typeof import",
  ],
  problem:
    "A module mock whose signature has drifted from the real module passes every test and fails in production.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
