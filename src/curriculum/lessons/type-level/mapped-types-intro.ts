import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "mapped-types-intro",
  title: "Mapped types",
  tier: "intermediate",
  track: "type-level",
  order: 8,
  summary:
    "{ [K in `keyof` T]: … } transforms every property of a type. This is how `Partial`, `Readonly`, and `Record` are actually defined.",
  prerequisites: ["keyof-operator", "indexed-access-types"],
  keywords: ["mapped type", "in keyof", "transform", "Partial", "homomorphic"],
  problem:
    "Hand-writing the nullable version of a twenty-field interface produces a second twenty-field interface to maintain. Shallow freeze with no type change. Name the shape so the broken call cannot compile quietly.",
  solution:
    "Mapped `readonly` fields reject assignment. Check the TypeScript example for the concrete refusal, then keep the takeaways as reusable rules. Keep the TypeScript types in view — they are the fix for the failure mode above.",
  js: {
    code: `function freeze(obj) { return obj; }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Shallow freeze with no type change.",
  },
  ts: {
    code: `type ReadonlyMap<T> = { readonly [K in keyof T]: T[K] };
type User = { id: string; name: string };
type Frozen = ReadonlyMap<User>;
const u: Frozen = { id: "1", name: "Ada" };
u.name = "Bob";
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Mapped `readonly` fields reject assignment.",
    expectedDiagnostics: [
      {
        code: 2540,
        line: 5,
        messageIncludes: "Cannot assign to 'name' because it is a read-onl",
      },
    ],
  },
  insight: [
    "Mapped types transform each property via [K in `keyof` T].",
    "`Readonly<T>` and `Partial<T>` are mapped types.",
    "Start here before conditional types.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What is the core pattern of a mapped type?",
      choices: [
        { id: "a", text: "extends `infer on` a function" },
        {
          id: "b",
          text: "Transform each property via `[K in keyof T]`",
        },
        { id: "c", text: "A runtime `Object.keys` loop" },
        { id: "d", text: "Only works on arrays" },
      ],
      answerId: "b",
      explanation:
        "Mapped types rebuild object types property-by-property; `Readonly` and `Partial` are the familiar built-ins.",
    },
  ],
};
