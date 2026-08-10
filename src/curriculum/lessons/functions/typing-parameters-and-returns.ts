import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-parameters-and-returns",
  title: "Parameters and return types",
  tier: "beginner",
  track: "functions",
  order: 1,
  summary:
    "Annotate what goes in and what comes out — and when inference already knows the return so you can skip writing it.",
  prerequisites: ["annotations-vs-inference", "primitive-types"],
  keywords: ["parameters", "return type", "function", "void"],
  problem:
    "A helper that sometimes returns a string and sometimes returns nothing becomes a landmine for every caller.",
  js: {
    code: `function formatCents(cents) {
  if (cents < 0) return;
  return (cents / 100).toFixed(2);
}

const label = "Total: $" + formatCents(499);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: 'Implicit `undefined` concatenates into "Total: $undefined".',
  },
  ts: {
    code: `function formatCents(cents: number): string {
  if (cents < 0) return;
  return (cents / 100).toFixed(2);
}
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "A declared string return forbids the bare return.",
    expectedDiagnostics: [
      { code: 2322, line: 2, messageIncludes: "undefined" },
    ],
  },
  insight: [
    "Parameter types are the contract callers must satisfy.",
    "Annotate returns on public functions; let inference handle simple internals.",
    "`void` means 'ignore the return'; `undefined` as a value is a different idea.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does `: string` on a function mean?",
      choices: [
        { id: "a", text: "Every parameter is a string" },
        { id: "b", text: "Successful returns must be string-compatible" },
        { id: "c", text: "The function may only be called with strings" },
        { id: "d", text: "Runtime validation runs automatically" },
      ],
      answerId: "b",
      explanation: "The annotation constrains the return expression(s).",
    },
  ],
  exercise: {
    prompt: "Return a string on the negative path too.",
    starter: `function formatCents(cents: number): string {
  if (cents < 0) return;
  return (cents / 100).toFixed(2);
}
`,
    assertion: "no-errors",
    hints: ['return "0.00" or throw'],
    solution: `function formatCents(cents: number): string {
  if (cents < 0) return "0.00";
  return (cents / 100).toFixed(2);
}
`,
  },
};
