import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "distributive-conditional-types",
  title: "Distributive conditional types",
  tier: "advanced",
  track: "type-level",
  order: 11,
  summary:
    "A naked type parameter distributes over a union, which is why Exclude works — and why your conditional type sometimes returns a union you did not ask for.",
  prerequisites: ["infer-keyword", "union-types"],
  keywords: [
    "distributive",
    "conditional type",
    "union",
    "naked type parameter",
    "Exclude",
  ],
  problem:
    "The same conditional type returns a different answer for a union than for each of its members, and nothing in the syntax hints at it.",
  js: {
    code: `// JS mental model: "filter the union" is a loop you invent.
function excludeNulls(values) {
  return values.filter((v) => v != null);
}

// Callers still think the array might contain null.
const cleaned = excludeNulls(["a", null, "b"]);
cleaned[0].toUpperCase(); // hope
`,
    highlights: [{ start: 7, end: 8 }],
    caption: "Runtime filtering does not change how callers type the result.",
  },
  ts: {
    code: `// Naked T distributes: ToArray<A | B> = ToArray<A> | ToArray<B>
type ToArray<T> = T extends unknown ? T[] : never;

type Distributed = ToArray<string | number>;
// string[] | number[] — not (string | number)[]

// Wrap T to turn distribution off:
type ToArrayNondist<T> = [T] extends [unknown] ? T[] : never;
type Combined = ToArrayNondist<string | number>;
// (string | number)[]

const oops: Distributed = [1, "a"];
// not assignable to string[] | number[]
`,
    highlights: [
      { start: 2, end: 2 },
      { start: 12, end: 13 },
    ],
    caption: "Naked parameters distribute; wrapping in a tuple disables it.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 12,
        messageIncludes: "not assignable",
      },
    ],
  },
  insight: [
    "Distribution happens when the checked type is a naked type parameter (not wrapped in another type constructor).",
    "Exclude<T, U> and Extract<T, U> rely on distribution: each union member is tested separately.",
    "Write [T] extends [U] (or T[] extends …) when you need the union kept together.",
  ],
  quiz: [
    {
      id: "dist-naked",
      prompt:
        "How do you stop a conditional type from distributing over a union?",
      choices: [
        { id: "a", text: "Add infer in the extends clause" },
        {
          id: "b",
          text: "Wrap the type parameter in a tuple: [T] extends […]",
        },
        { id: "c", text: "Use a mapped type instead" },
        { id: "d", text: "Enable strictNullChecks" },
      ],
      answerId: "b",
      explanation:
        "Wrapping removes the “naked” property, so the whole union is checked as one.",
    },
  ],
  exercise: {
    prompt:
      "Implement NonNullableish<T> that removes null and undefined from a union (like NonNullable). The solution must type-check with a string assignment.",
    starter: `type NonNullableish<T> = T; // TODO: distribute and exclude null | undefined

const x: NonNullableish<string | null> = null; // should not be allowed once fixed
`,
    assertion: "no-errors",
    hints: ["T extends null | undefined ? never : T"],
    solution: `type NonNullableish<T> = T extends null | undefined ? never : T;

const x: NonNullableish<string | null> = "ok";
void x;
`,
  },
};
