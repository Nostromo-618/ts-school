import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-javascript-with-jsdoc",
  title: "Typing JavaScript with JSDoc",
  tier: "intermediate",
  track: "foundations",
  order: 14,
  summary:
    "`checkJs` plus JSDoc annotations gives an existing `.js` codebase real checking with no build step and no file renames — the cheapest first move in a migration.",
  prerequisites: ["declaration-files-intro", "annotations-vs-inference"],
  keywords: [
    "jsdoc",
    "checkJs",
    "allowJs",
    "@type",
    "migration",
    "no build step",
  ],
  problem:
    "JSDoc types in a `.js` file. This is the everyday mistake that makes TypeScript feel optional until a rename or a `null` slips through. Learn the refusal here; every later track assumes you trust it. Trust the squiggle; it is cheaper than the incident.",
  solution:
    "Same contract in TS syntax. greet returns string. JSDoc + `checkJs` types an existing JS codebase. Migration path: JSDoc first, then rename to `.ts`. Keep JSDoc honest — it is checked like annotations. Apply the same refusal at the next boundary you own.",
  js: {
    code: `/** @param {string} name */
function greet(name) { return name.toUpperCase(); }
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "JSDoc types in a `.js` file.",
  },
  ts: {
    code: `// JSDoc in .js under checkJs mirrors these annotations:
function greet(name: string): string {
  return name.toUpperCase();
}
const s: string = greet("ada");
const bad: number = greet("ada");
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Same contract in TS syntax. greet returns string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "JSDoc + `checkJs` types an existing JS codebase.",
    "Migration path: JSDoc first, then rename to `.ts`.",
    "Keep JSDoc honest — it is checked like annotations.",
  ],
};
