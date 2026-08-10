import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "migrating-a-large-codebase",
  title: "Migrating something large",
  tier: "advanced",
  track: "node-migration",
  order: 23,
  summary:
    "Strangler boundaries, per-directory strictness, codemods, and a ratchet in CI so the error count can only go down.",
  prerequisites: ["renaming-your-first-file", "ci-gates-for-types"],
  keywords: [
    "migration",
    "strangler",
    "ratchet",
    "codemod",
    "strategy",
    "legacy",
  ],
  problem:
    "A migration that has to finish before it delivers value is a migration that gets cancelled at the halfway point. Look at the left pane: all-or-nothing migrations rarely finish. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Ratchets track counts — the budget is a number, not a string. Ship value continuously: `strict` islands expand; legacy shrinks. CI ratchets (error count / `any` count) beat a binary pass/fail on a half-migrated tree. Codemods + `allowJs` get files into the graph; types follow folder by folder. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
  js: {
    code: `// JS big-bang rewrite: replace everything, ship nothing for months.
function migrateAll() {
  throw new Error("not done");
}
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "All-or-nothing migrations rarely finish.",
  },
  ts: {
    code: `type DirStrictness = { path: string; strict: boolean };

// Strangler: new code is strict; legacy paths loosen gradually.
const policy: DirStrictness[] = [
  { path: "src/new/", strict: true },
  { path: "src/legacy/", strict: false },
];

type Ratchet = { maxErrors: number };
const ratchet: Ratchet = { maxErrors: 400 };

function assertImproving(prev: number, next: number, budget: Ratchet) {
  if (next > budget.maxErrors) throw new Error("over budget");
  if (next > prev) throw new Error("errors increased");
}

assertImproving(410, 405, ratchet);
const bad: Ratchet = { maxErrors: "many" as unknown as number };
void bad;
const worse: string = ratchet.maxErrors;
`,
    highlights: [{ start: 18, end: 18 }],
    caption: "Ratchets track counts — the budget is a number, not a string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 20,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "Ship value continuously: `strict` islands expand; legacy shrinks.",
    "CI ratchets (error count / `any` count) beat a binary pass/fail on a half-migrated tree.",
    "Codemods + `allowJs` get files into the graph; types follow folder by folder.",
  ],
  quiz: [
    {
      id: "mig-q",
      prompt: "What is a type error ratchet?",
      choices: [
        { id: "a", text: "A tool that deletes all anys overnight" },
        { id: "b", text: "A CI rule that forbids the error count from rising" },
        { id: "c", text: "A `tsconfig` that disables checking" },
        { id: "d", text: "A bundler plugin" },
      ],
      answerId: "b",
      explanation:
        "Ratchets allow a known baseline while blocking regressions.",
    },
  ],
  exercise: {
    prompt:
      "Type RatchetState = { errors: number } and function better(a, b) that returns the smaller errors count.",
    starter: `type RatchetState = { errors: number };
function better(a: RatchetState, b: RatchetState) {
  return a;
}
`,
    assertion: "no-errors",
    hints: ["return a.errors < b.errors ? a.errors : b.errors"],
    solution: `type RatchetState = { errors: number };
function better(a: RatchetState, b: RatchetState): number {
  return a.errors < b.errors ? a.errors : b.errors;
}
void better({ errors: 10 }, { errors: 8 });
`,
  },
};
