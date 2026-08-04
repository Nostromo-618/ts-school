import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "indexed-access-types",
  title: "Indexed access types",
  tier: "intermediate",
  track: "type-level",
  order: 3,
  summary:
    "User['id'], Routes[keyof Routes], and array element types via T[number] — reading a type out of another type.",
  prerequisites: ["keyof-operator"],
  keywords: [
    "indexed access",
    "lookup type",
    "T[number]",
    "element type",
    "keyof",
  ],
  problem:
    "Duplicating a nested field's type gives you two declarations to keep in step and no error when they drift.",
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
};
