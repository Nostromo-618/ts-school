import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "strictpropertyinitialization",
  title: "strictPropertyInitialization",
  tier: "intermediate",
  track: "tooling",
  order: 8,
  summary:
    "Class fields must be assigned by the end of the constructor. What that catches, and the three legitimate escape hatches.",
  prerequisites: ["the-strictness-ladder", "classes-intro"],
  keywords: [
    "strictPropertyInitialization",
    "class",
    "field",
    "definite assignment",
    "constructor",
  ],
  problem:
    'Fields used before assigned. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "strictPropertyInitialization" as a CI gate, not a personal preference.',
  solution:
    "Strict property initialization requires assigning name. Definite assignment analysis catches uninitialised fields. Use definite assignment assertions sparingly (!). Constructor parameter properties satisfy the check. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `class User { name; constructor() {} }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Fields used before assigned.",
  },
  ts: {
    code: `class User {
  name: string;
  constructor() {}
}
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Strict property initialization requires assigning name.",
    expectedDiagnostics: [
      {
        code: 2564,
        line: 2,
        messageIncludes: "Property 'name' has no initializer and is not de",
      },
    ],
  },
  insight: [
    "Definite assignment analysis catches uninitialised fields.",
    "Use definite assignment assertions sparingly (!).",
    "Constructor parameter properties satisfy the check.",
  ],
};
