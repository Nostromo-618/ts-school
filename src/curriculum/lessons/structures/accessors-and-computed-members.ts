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
    "A setter that accepts a string and a getter that returns a Date is a useful API and an awkward one to type. Look at the left pane: computed key access without relating key to value. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "`typeof` key ties the read to string. Not number. Computed keys work with literal types and `keyof`. Getters/setters can enforce invariants at the boundary. Prefer methods when side effects are involved. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
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
