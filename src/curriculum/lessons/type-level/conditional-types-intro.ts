import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "conditional-types-intro",
  title: "Conditional types",
  tier: "intermediate",
  track: "type-level",
  order: 7,
  summary:
    "T extends U ? X : Y is an if statement in the type system. Where it is genuinely the right tool, and where a union would have done.",
  prerequisites: ["generic-constraints", "utility-types-tour"],
  keywords: ["conditional type", "extends", "branch", "ternary", "generic"],
  problem:
    "Runtime `typeof` checks only. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases. Hover the resulting type; if it widened, the transform is wrong.",
  solution:
    "Conditional type yields false for number — true is not assignable. T extends U ? X : Y branches in the type system. They power many library utilities. Distribute over naked type parameters — learn that next. The dual panes are the lesson: left fails, right refuses.",
  js: {
    code: `function unwrap(x) { return x; }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Runtime `typeof` checks only.",
  },
  ts: {
    code: `type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">;
type B = IsString<number>;
const ok: A = true;
const bad: B = true;
`,
    highlights: [{ start: 5, end: 5 }],
    caption:
      "Conditional type yields false for number — true is not assignable.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 5,
        messageIncludes: "Type 'true' is not assignable to type 'false'.",
      },
    ],
  },
  insight: [
    "T extends U ? X : Y branches in the type system.",
    "They power many library utilities.",
    "Distribute over naked type parameters — learn that next.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "What does type IsString<T> = T extends string ? true : false do?",
      choices: [
        { id: "a", text: "Converts T to a string at runtime" },
        {
          id: "b",
          text: "Resolves to the literal true or false depending on whether T extends string",
        },
        { id: "c", text: "Always yields string" },
        { id: "d", text: "Throws if T is not a string" },
      ],
      answerId: "b",
      explanation:
        "Conditional types choose a branch in the type system; there is no runtime check.",
    },
  ],
};
