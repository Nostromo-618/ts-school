import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "accessors-and-computed-members",
  title: "Accessors and computed members",
  tier: "intermediate",
  track: "structures",
  order: 16,
  summary:
    "get and set with different types, computed property names, and how the checker treats a getter-only property as `readonly`.",
  prerequisites: ["classes-intro", "readonly-and-immutability"],
  keywords: ["getter", "setter", "accessor", "computed property", "readonly"],
  problem:
    "Computed key access without relating key to value. Object and class APIs leak through optional fields, mutable shared state, or signatures that do not match how instances are actually used. Tighten the shape so consumers cannot rely on properties you `never` meant to promise. Consumers will depend on whatever the type allows, including accidents.",
  solution:
    "`typeof` key ties the read to string. Computed keys work with literal types and `keyof`. Getters/setters can enforce invariants at the boundary. Prefer methods when side effects are involved. Let inference work locally; annotate what crosses modules.",
  js: {
    code: `const key = 'id';
obj[key] = 1;
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Computed key access without relating key to value.",
  },
  ts: {
    code: `type User = { id: string; name: string };
const key = "id" as const;

function read(u: User, k: typeof key): string {
  return u[k];
}

const u: User = { id: "1", name: "Ada" };
const id: string = read(u, "id");
const bad: number = read(u, "id");
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "`typeof` key ties the read to string. Not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 10,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Computed keys work with literal types and `keyof`.",
    "Getters/setters can enforce invariants at the boundary.",
    "Prefer methods when side effects are involved.",
  ],
};
