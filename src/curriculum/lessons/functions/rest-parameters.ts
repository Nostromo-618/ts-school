import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "rest-parameters",
  title: "Rest parameters and spread",
  tier: "beginner",
  track: "functions",
  order: 3,
  summary:
    "Typing ...args as a tuple or an array — and why spreading the wrong shape fails at the call site instead of inside the loop.",
  prerequisites: ["typing-parameters-and-returns", "arrays-and-tuples"],
  keywords: ["rest", "spread", "...", "variadic"],
  problem:
    "A logger that takes 'any number of values' eventually receives an options object in the middle of the list. arguments is untyped; string sneaks into numeric reduce.",
  solution:
    "Rest element types apply to every variadic argument. Aim for a shape where the bad state is unrepresentable — or at least loudly illegal before it runs. Keep the TypeScript types in view — they are the fix for the failure mode above.",
  js: {
    code: `function sum() {
  return [...arguments].reduce((a, b) => a + b, 0);
}

sum(1, 2, "3");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "arguments is untyped; string sneaks into numeric reduce.",
  },
  ts: {
    code: `function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

sum(1, 2, "3");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Rest element types apply to every variadic argument.",
    expectedDiagnostics: [{ code: 2345, line: 5, messageIncludes: "string" }],
  },
  insight: [
    "...nums: number[] means zero or more numbers.",
    "For a fixed head plus rest, use a tuple rest: ...args: [string, ...number[]].",
    "Prefer rest over arguments — rest is an array with a real type.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What is the type of nums inside sum(...nums: number[])?",
      choices: [
        { id: "a", text: "number" },
        { id: "b", text: "number[]" },
        { id: "c", text: "arguments" },
        { id: "d", text: "`unknown`" },
      ],
      answerId: "b",
      explanation: "Rest parameters are arrays of the element type.",
    },
  ],
  exercise: {
    prompt: "Call sum with only numbers.",
    starter: `function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

sum(1, 2, "3");
`,
    assertion: "no-errors",
    hints: ["sum(1, 2, 3)"],
    solution: `function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3);
`,
  },
};
