import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "allowjs-and-checkjs",
  title: "allowJs and checkJs",
  tier: "beginner",
  track: "node-migration",
  order: 3,
  summary:
    "Type-check existing `.js` with JSDoc while `allowJs` keeps those files in the program — the bridge before renames.",
  prerequisites: ["adding-typescript-to-an-existing-project"],
  keywords: ["allowJs", "checkJs", "JSDoc", "@ts-check"],
  problem:
    "New `.ts` files sit next to untyped `.js`, and the old bugs quietly re-enter through the door you left open. Without `checkJs`, JavaScript neighbors are invisible to the checker — so the migration feels unfinished even after you 'added TypeScript.' JSDoc can be a lightweight contract while files wait to be renamed.",
  solution:
    "`allowJs` pulls `.js` into the project; `checkJs` type-checks them. A file-level `// @ts-check` enables checking even when `checkJs` is not global. `@param` / `@returns` JSDoc unlocks a surprising amount of safety without a rename yet. Aim for the same diagnostic you would want in `.ts` — then rename when the shape is stable.",
  js: {
    code: `// @ts-check
/** @param {number} n */
export function double(n) {
  return n * 2;
}

double("2");
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "With `checkJs`, JSDoc becomes a lightweight contract.",
  },
  ts: {
    code: `// The TS equivalent of a checkJs finding:
export function double(n: number): number {
  return n * 2;
}

double("2");
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Same error you want `checkJs` to surface in `.js` files.",
    expectedDiagnostics: [{ code: 2345, line: 6, messageIncludes: "string" }],
  },
  insight: [
    "`allowJs` includes `.js` in the project; `checkJs` type-checks them.",
    "// @ts-check at the top of a file enables checking even without `checkJs` globally.",
    "JSDoc @param/@returns is enough to unlock many migrations without a rename yet.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does `checkJs` do?",
      choices: [
        { id: "a", text: "Converts JS to TS automatically" },
        { id: "b", text: "Type-checks JavaScript files in the program" },
        { id: "c", text: "Disables `allowJs`" },
        { id: "d", text: "Removes JSDoc" },
      ],
      answerId: "b",
      explanation: "It runs the checker over `.js` with JSDoc support.",
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
