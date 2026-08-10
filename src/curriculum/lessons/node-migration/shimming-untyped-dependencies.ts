import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "shimming-untyped-dependencies",
  title: "Dependencies with no types",
  tier: "advanced",
  track: "node-migration",
  order: 22,
  summary:
    "`declare` module shims, writing just enough of a definition to be useful, and when to send it to DefinitelyTyped instead of keeping it.",
  prerequisites: ["module-augmentation", "installing-types"],
  keywords: ["declare module", "shim", "ambient", "DefinitelyTyped", "untyped"],
  problem:
    "One untyped dependency turns a whole call graph into `any`, and `noImplicitAny` cannot see through it. Teams either abandon the library or sprinkle casts until the checker is decorative.",
  solution:
    "Write a minimal ambient module declaration for the surface you actually call — not a fake full API. Prefer upstream types or a thin typed wrapper you control. Keep the shim honest: if the runtime can return `null`, the declaration must say so. Expand the `.d.ts` only as you touch more of the library.",
  js: {
    code: `// JS: require an untyped helper and pass anything.
const slugify = require("legacy-slugify");
slugify(null);
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Untyped deps accept anything and return anything.",
  },
  ts: {
    code: `// Local shim standing in for declare module "legacy-slugify".
type Slugify = (input: string) => string;
declare const slugify: Slugify;

const s = slugify("Hello World");
const bad = slugify(null);
void s;
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "A minimal shim restores checking at the boundary.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 6,
        messageIncludes: "null",
      },
    ],
  },
  insight: [
    "Start with a narrow shim of the functions you call — not a full fictional API.",
    'In real projects that shim is `declare module "pkg" { … }` in a .d.ts.',
    "Prefer @types from DefinitelyTyped when available; contribute improvements upstream.",
  ],
  security: {
    title: "Optimistic shims can over-promise",
    body: "If your .d.ts claims safer types than the library provides, you invent guarantees. Keep shims honest — especially around encoding, paths, and crypto helpers.",
    severity: "caution",
  },
  quiz: [
    {
      id: "shim-q",
      prompt: "Best first shim for a single function dependency?",
      choices: [
        { id: "a", text: '`declare` module "pkg" { const x: `any`; export = x }' },
        {
          id: "b",
          text: '`declare` module "pkg" { export function fn(/* real args */): /* real return */ }',
        },
        { id: "c", text: "Delete the dependency" },
        { id: "d", text: "Use eval to load it" },
      ],
      answerId: "b",
      explanation:
        "Type only what you call, accurately — avoid `any`-shaped modules.",
    },
  ],
  exercise: {
    prompt:
      "Type Add = (a: number, b: number) => number and call a `declare` const add: Add.",
    starter: `type Add = (a: number, b: number) => number;
`,
    assertion: "no-errors",
    hints: ["`declare` const add: Add; `void` add(1, 2);"],
    solution: `type Add = (a: number, b: number) => number;
declare const add: Add;
void add(1, 2);
`,
  },
};
