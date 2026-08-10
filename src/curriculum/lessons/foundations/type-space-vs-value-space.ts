import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-space-vs-value-space",
  title: "Type space against value space",
  tier: "intermediate",
  track: "foundations",
  order: 13,
  summary:
    "The same identifier can name a value, a type, or both. Which declarations create which, and how `typeof` and `keyof` cross between the two worlds.",
  prerequisites: ["structural-typing", "types-are-erased"],
  keywords: [
    "type space",
    "value space",
    "typeof",
    "declaration merging",
    "namespace",
  ],
  problem:
    "Cannot find name X — used as a value — appears when you reference a type where a value was needed, and the message `never` says which space it looked in.",
  js: {
    code: `const User = { id: 1 };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "One name, no type/value distinction.",
  },
  ts: {
    code: `type User = { id: string };
const User = { id: "1" };
const u: User = User;
const bad: number = u.id;
`,
    highlights: [{ start: 4, end: 4 }],
    caption:
      "Types and values inhabit different spaces; same name can coexist. id is string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 4,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "type/interface live in type space; const/function in value space.",
    "`typeof` bridges value to type.",
    "Confusion here causes 'used as a value' errors.",
  ],
};
