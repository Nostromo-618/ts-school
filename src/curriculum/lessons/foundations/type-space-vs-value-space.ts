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
    "The same name can mean a type and a value (`Null` vs `null`, class shapes, `typeof` confusion). Mixing the spaces produces errors that look mystical until you ask which world a name lives in.",
  solution:
    "Types are erased; values exist at runtime. `typeof` in type position queries a value's type; `typeof` in value position is JavaScript. Classes contribute both. When an error mentions 'used as a type' or 'used as a value,' you crossed the boundary.",
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
