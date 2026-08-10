import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "installing-types",
  title: "Getting types for your dependencies",
  tier: "beginner",
  track: "node-migration",
  order: 4,
  summary:
    "Bundled types versus DefinitelyTyped (@types/*) — how to tell which you need and what to do when neither exists.",
  prerequisites: [
    "declaration-files-intro",
    "adding-typescript-to-an-existing-project",
  ],
  keywords: ["@types", "DefinitelyTyped", "types field", "bundled types"],
  problem:
    "`import express from 'express'` fails type-checking until `@types/express` is installed — or until the package ships its own types. Runtime works; the editor has no API surface. That gap trains people to silence `TS2307` instead of fixing the dependency boundary.",
  solution:
    "Prefer packages that ship a `types` / `exports` types condition. When needed, install `@types/foo` as a devDependency matching foo's major. `TS2307` until types exist is the correct refusal — bundled declarations or DefinitelyTyped, not a cast to `any`.",
  js: {
    code: `const leftPad = require("left-pad");
leftPad("x", 3);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Runtime works; the editor has no API surface.",
  },
  ts: {
    code: `import leftPad from "left-pad";

export const padded = leftPad("x", 3);
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "`TS2307` until types exist — bundled or @types.",
    expectedDiagnostics: [{ code: 2307, line: 1, messageIncludes: "left-pad" }],
  },
  insight: [
    'Check `package.json` "types" / "exports".types before reaching for @types.',
    "Install @types/foo as a devDependency matching the major of foo when needed.",
    'If nothing exists, write a minimal `declare` module "foo" locally and upstream later.',
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Where do @types packages usually belong?",
      choices: [
        { id: "a", text: "dependencies" },
        { id: "b", text: "devDependencies" },
        { id: "c", text: "peerDependencies only" },
        { id: "d", text: "optionalDependencies" },
      ],
      answerId: "b",
      explanation: "They are build-time only for apps (libraries may differ).",
    },
  ],
  exercise: {
    prompt: "Replace the import with a local typed function.",
    starter: `import leftPad from "left-pad";

export const padded = leftPad("x", 3);
`,
    assertion: "no-errors",
    hints: [
      "function leftPad(s: string, n: number): string { return s.padStart(n); }",
    ],
    solution: `function leftPad(value: string, length: number): string {
  return value.padStart(length);
}

export const padded = leftPad("x", 3);
`,
  },
};
