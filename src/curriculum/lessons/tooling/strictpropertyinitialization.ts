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
    "A field initialised in an async init method is `undefined` for every call that arrives before it, and the type says otherwise. Fields used before assigned. Definite assignment analysis catches uninitialised fields.",
  solution:
    "Strict property initialization requires assigning name. Definite assignment analysis catches uninitialised fields. Use definite assignment assertions sparingly (!). Constructor parameter properties satisfy the check.",
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
