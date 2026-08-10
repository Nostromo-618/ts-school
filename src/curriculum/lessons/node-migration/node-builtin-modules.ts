import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "node-builtin-modules",
  title: "node: builtins and @types/node",
  tier: "beginner",
  track: "node-migration",
  order: 5,
  summary:
    "Prefer node:fs imports and install @types/node so builtins have accurate typings for your Node version.",
  prerequisites: ["installing-types"],
  keywords: ["node:", "@types/node", "fs", "builtins"],
  problem:
    'Wrong path type is a runtime TypeError. Migration does not change Node\'s runtime — it surfaces the unions and module edges you already had to handle. Fix the seam "node: builtins and @types/node" names before you rename the next hundred files.',
  solution:
    "Install @types/node (and use node: specifiers) in real projects. node:fs makes builtin imports explicit and avoids npm package name clashes. @types/node versions should track your engines.node range. Until types are installed, stub only what you need — don't invent a fake full fs. Apply the same refusal at the next boundary you own.",
  js: {
    code: `const fs = require("fs");
fs.readFileSync(42, "utf8");
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Wrong path type is a runtime TypeError.",
  },
  ts: {
    code: `// This sandbox has no @types/node — the import cannot resolve.
import { readFileSync } from "node:fs";

export const text = readFileSync(42, "utf8");
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Install @types/node (and use node: specifiers) in real projects.",
    expectedDiagnostics: [{ code: 2591, line: 2, messageIncludes: "node:fs" }],
  },
  insight: [
    "node:fs makes builtin imports explicit and avoids npm package name clashes.",
    "@types/node versions should track your engines.node range.",
    "Until types are installed, stub only what you need — don't invent a fake full fs.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: 'Why prefer import from "node:fs"?',
      choices: [
        { id: "a", text: "It is faster at runtime always" },
        {
          id: "b",
          text: "It clearly targets the Node builtin, not an npm package named fs",
        },
        { id: "c", text: "TypeScript requires it" },
        { id: "d", text: "It disables `strict` mode" },
      ],
      answerId: "b",
      explanation: "The node: scheme disambiguates builtins.",
    },
  ],
  exercise: {
    prompt: "Provide a local typed readFileSync stub.",
    starter: `import { readFileSync } from "node:fs";

export const text = readFileSync(42, "utf8");
`,
    assertion: "no-errors",
    hints: [
      "Remove import; `declare` function readFileSync(path: string, enc: string): string",
    ],
    solution: `declare function readFileSync(path: string, encoding: string): string;

export const text = readFileSync("README.md", "utf8");
`,
  },
};
