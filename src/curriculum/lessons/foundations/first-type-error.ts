import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "first-type-error",
  title: "Your first type error",
  tier: "beginner",
  track: "foundations",
  order: 2,
  summary:
    "Point `tsc` at a JavaScript file you already have, watch it disagree with you, and learn the shortest loop between writing a line and being told it is wrong.",
  prerequisites: ["why-types"],
  keywords: ["tsc", "cli", "noEmit", "checkJs", "first error"],
  problem:
    "`String` coercion turns tax math into concatenation or NaN territory. This is the everyday mistake that makes TypeScript feel optional until a rename or a `null` slips through. Learn the refusal here; every later track assumes you trust it. Trust the squiggle; it is cheaper than the incident.",
  solution:
    "`TS2345`: the argument type must match the parameter. Read a TypeScript error bottom-up: expected type, actual type, then the expression on the flagged line. The error code (here 2345) is stable; the prose may change between TypeScript releases. Fix the types at the boundary (parse the query string) rather than widening the parameter to string | number. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `function addTax(amount) {
  return amount * 1.2;
}

// Price arrived as a string from a query param.
addTax("19.99");
`,
    highlights: [{ start: 5, end: 5 }],
    caption:
      "`String` coercion turns tax math into concatenation or NaN territory.",
  },
  ts: {
    code: `function addTax(amount: number): number {
  return amount * 1.2;
}

addTax("19.99");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "`TS2345`: the argument type must match the parameter.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 5,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Read a TypeScript error bottom-up: expected type, actual type, then the expression on the flagged line.",
    "The error code (here 2345) is stable; the prose may change between TypeScript releases.",
    "Fix the types at the boundary (parse the query string) rather than widening the parameter to string | number.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does `TS2345` mean in this lesson?",
      choices: [
        { id: "a", text: "A module could not be resolved" },
        {
          id: "b",
          text: "An argument's type is not assignable to the parameter",
        },
        { id: "c", text: "A variable was used before declaration" },
        { id: "d", text: "A return type was omitted" },
      ],
      answerId: "b",
      explanation:
        "2345 is the 'argument of type X is not assignable to parameter of type Y' family.",
    },
  ],
  exercise: {
    prompt: "Make addTax compile: parse the string before calling.",
    starter: `function addTax(amount: number): number {
  return amount * 1.2;
}

addTax("19.99");
`,
    assertion: "no-errors",
    hints: ['Number("19.99") or parseFloat — then pass the number.'],
    solution: `function addTax(amount: number): number {
  return amount * 1.2;
}

addTax(Number("19.99"));
`,
  },
};
