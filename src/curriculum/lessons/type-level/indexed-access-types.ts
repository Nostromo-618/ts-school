import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "indexed-access-types",
  title: "Indexed access types",
  tier: "intermediate",
  track: "type-level",
  order: 3,
  summary:
    "User['id'], Routes[`keyof` Routes], and array element types via T[number] — reading a type out of another type.",
  prerequisites: ["keyof-operator"],
  keywords: [
    "indexed access",
    "lookup type",
    "T[number]",
    "element type",
    "keyof",
  ],
  problem:
    "Duplicating a nested field's type gives you two declarations to keep in step and no error when they drift. Nested field access without a named nested type. Until that contract is checkable, “Indexed access types” stays a runtime surprise.",
  solution:
    "Indexed access digs out number. string fails. When the types name the contract, a quiet ship becomes a red squiggle at the call site instead. Keep the TypeScript types in view — they are the fix for the failure mode above.",
  js: {
    code: `function ageOf(user) {
  return user.age;
}
`,
    highlights: [{ start: 1, end: 3 }],
    caption: "Nested field access without a named nested type.",
  },
  ts: {
    code: `type User = { id: string; profile: { age: number } };
type Age = User["profile"]["age"];
const a: Age = 30;
const bad: Age = "30";
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "Indexed access digs out number. string fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 4,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "T['key'] extracts a property type.",
    "Chain for nested fields.",
    "Useful when you do not want to export every nested alias.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does User['id'] mean as a type?",
      choices: [
        { id: "a", text: "A runtime property lookup" },
        {
          id: "b",
          text: "The type of the id property on User",
        },
        { id: "c", text: "An array of all User keys" },
        { id: "d", text: "A mapped type over User" },
      ],
      answerId: "b",
      explanation:
        "Indexed access extracts a property's type so you can reuse nested shapes without exporting every alias.",
    },
  ],
};
