import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "allowjs-and-checkjs",
  title: "allowJs and checkJs",
  tier: "beginner",
  track: "node-migration",
  order: 3,
  summary:
    "Type-check existing .js with JSDoc while allowJs keeps those files in the program — the bridge before renames.",
  prerequisites: ["adding-typescript-to-an-existing-project"],
  keywords: ["allowJs", "checkJs", "JSDoc", "@ts-check"],
  problem:
    "Untyped .js sits next to new .ts and silently reintroduces the bugs you adopted TypeScript to catch.",
  js: {
    code: `// @ts-check
/** @param {number} n */
export function double(n) {
  return n * 2;
}

double("2");
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "With checkJs, JSDoc becomes a lightweight contract.",
  },
  ts: {
    code: `// The TS equivalent of a checkJs finding:
export function double(n: number): number {
  return n * 2;
}

double("2");
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Same error you want checkJs to surface in .js files.",
    expectedDiagnostics: [{ code: 2345, line: 6, messageIncludes: "string" }],
  },
  insight: [
    "allowJs includes .js in the project; checkJs type-checks them.",
    "// @ts-check at the top of a file enables checking even without checkJs globally.",
    "JSDoc @param/@returns is enough to unlock many migrations without a rename yet.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does checkJs do?",
      choices: [
        { id: "a", text: "Converts JS to TS automatically" },
        { id: "b", text: "Type-checks JavaScript files in the program" },
        { id: "c", text: "Disables allowJs" },
        { id: "d", text: "Removes JSDoc" },
      ],
      answerId: "b",
      explanation: "It runs the checker over .js with JSDoc support.",
    },
  ],
  exercise: {
    prompt: "Pass a number to double.",
    starter: `export function double(n: number): number {
  return n * 2;
}

double("2");
`,
    assertion: "no-errors",
    hints: ["double(2)"],
    solution: `export function double(n: number): number {
  return n * 2;
}

double(2);
`,
  },
};
