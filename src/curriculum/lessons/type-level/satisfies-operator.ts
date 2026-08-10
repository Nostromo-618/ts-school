import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "satisfies-operator",
  title: "satisfies",
  tier: "intermediate",
  track: "type-level",
  order: 6,
  summary:
    "Check a value against a type without widening to that type — keep the literals you care about.",
  prerequisites: ["typeof-type-queries", "const-assertions"],
  keywords: ["satisfies", "validation", "inference", "literals", "config"],
  problem:
    "Palette validated only by convention. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases. Hover the resulting type; if it widened, the transform is wrong.",
  solution:
    "`satisfies` checks the value while preserving literals. danger is not number. `satisfies` checks against a type without widening to it. Preserves literal inference for keys/values. Prefer it over as when you want both check and inference. Let inference work locally; annotate what crosses modules.",
  js: {
    code: `const palette = { primary: "#0af", danger: "red" };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Palette validated only by convention.",
  },
  ts: {
    code: `type Hex = \`#\${string}\`;
type Palette = Record<string, Hex | "red" | "blue">;

const palette = {
  primary: "#0af",
  danger: "red",
} satisfies Palette;

const p: Hex | "red" | "blue" = palette.primary;
const bad: number = palette.danger;
`,
    highlights: [{ start: 11, end: 11 }],
    caption:
      "`satisfies` checks the value while preserving literals. danger is not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 10,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "`satisfies` checks against a type without widening to it.",
    "Preserves literal inference for keys/values.",
    "Prefer it over as when you want both check and inference.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "Compared to `const x: Palette = {...}`, what does `satisfies Palette` keep?",
      choices: [
        { id: "a", text: "A narrower inferred type (literals / keys)" },
        { id: "b", text: "Runtime validation of hex codes" },
        { id: "c", text: "Automatic `as const` on every nested value only" },
        { id: "d", text: "Exemption from excess property checks" },
      ],
      answerId: "a",
      explanation:
        "`satisfies` verifies assignability while leaving the expression's inferred type in place.",
    },
  ],
};
