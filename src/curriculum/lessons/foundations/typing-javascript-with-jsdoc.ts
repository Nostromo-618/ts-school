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
    "A large Node codebase cannot be renamed to `.ts` in one commit, and until it is, nothing is checked at all. Look at the left pane: jSDoc types in a `.js` file. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Same contract in TS syntax. greet returns string. JSDoc + `checkJs` types an existing JS codebase. Migration path: JSDoc first, then rename to `.ts`. Keep JSDoc honest — it is checked like annotations. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
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
