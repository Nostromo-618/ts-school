import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "tsconfig-essentials",
  title: "tsconfig.json: the options that matter first",
  tier: "beginner",
  track: "foundations",
  order: 10,
  summary:
    "A `tsconfig` for a Node service, option by option: `target`, `module`, `moduleResolution`, `lib`, `outDir`, `rootDir`, `strict`, and `skipLibCheck`.",
  prerequisites: ["strict-mode"],
  keywords: ["tsconfig", "target", "module", "lib", "outDir", "configuration"],
  problem:
    "Module format is a runtime/config concern; types inherit the mess. This is the everyday mistake that makes TypeScript feel optional until a rename or a `null` slips through. Learn the refusal here; every later track assumes you trust it. Trust the squiggle; it is cheaper than the incident.",
  solution:
    "Wrong module assumptions surface as 'Cannot find name require' — fix config, don't cast. For Node today: `module`/`moduleResolution` bundler or nodenext, `target` es2022+, `strict` true. `lib` should match your runtime — do not pull `dom` into a pure Node service. `skipLibCheck` speeds builds by skipping `.d.ts` checking; it does not fix your code. Make the impossible state unrepresentable, then move on.",
  js: {
    code: `// package.json "type": "module" but code still uses require —
// config and runtime disagree long before types enter the picture.
const fs = require("fs");
module.exports = { read: (p) => fs.readFileSync(p, "utf8") };
`,
    highlights: [{ start: 3, end: 4 }],
    caption:
      "Module format is a runtime/config concern; types inherit the mess.",
  },
  ts: {
    code: `// This site's checker uses ESNext modules. CommonJS require is not defined.
const fs = require("fs");

export function read(path: string): string {
  return fs.readFileSync(path, "utf8");
}
`,
    highlights: [{ start: 2, end: 2 }],
    caption:
      "Wrong module assumptions surface as 'Cannot find name require' — fix config, don't cast.",
    expectedDiagnostics: [
      {
        code: 2591,
        line: 2,
        messageIncludes: "require",
      },
    ],
  },
  insight: [
    "For Node today: `module`/`moduleResolution` bundler or nodenext, `target` es2022+, `strict` true.",
    "`lib` should match your runtime — do not pull `dom` into a pure Node service.",
    "`skipLibCheck` speeds builds by skipping `.d.ts` checking; it does not fix your code.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: 'Why avoid `"lib": ["dom"]` in a Node API service?',
      choices: [
        {
          id: "a",
          text: "DOM types make the compiler slower and invent browser globals",
        },
        { id: "b", text: "Node cannot run JavaScript" },
        { id: "c", text: "`strict` mode requires it" },
        { id: "d", text: "It disables `noEmit`" },
      ],
      answerId: "a",
      explanation:
        "`dom` adds `window`/`document` and related types that hide mistakes in server code.",
    },
  ],
  exercise: {
    prompt:
      "Replace require with a local typed stub so the file type-checks under ESM.",
    starter: `const fs = require("fs");

export function read(path: string): string {
  return fs.readFileSync(path, "utf8");
}
`,
    assertion: "no-errors",
    hints: [
      "Declare a minimal fs object: const fs = { readFileSync(path: string, enc: string): string { return path + enc; } };",
    ],
    solution: `const fs = {
  readFileSync(path: string, _enc: string): string {
    return path;
  },
};

export function read(path: string): string {
  return fs.readFileSync(path, "utf8");
}
`,
  },
  references: [
    {
      title: "TSConfig Reference",
      href: "https://www.typescriptlang.org/tsconfig/",
      note: "Authoritative option list.",
    },
  ],
};
