import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "adding-typescript-to-an-existing-project",
  title: "Adding TypeScript to a project that works",
  tier: "beginner",
  track: "node-migration",
  order: 2,
  summary:
    "Install typescript, add a `tsconfig`, and keep shipping JS while the checker watches over your shoulder.",
  prerequisites: ["why-migrate-a-node-service", "tsconfig-essentials"],
  keywords: ["adopt", "tsconfig", "incremental", "devDependency"],
  problem:
    "Teams often treat adopting TypeScript as a big-bang rename: every file must become `.ts` before anyone gets value. That belief blocks the first win. You can keep the runtime entry in JavaScript, add a pinned `typescript` (and a minimal `strict` `tsconfig`), and start checking beside the code that already works — without freezing the roadmap for a month.",
  solution:
    "Add TypeScript as a pinned devDependency and commit a small `strict` `tsconfig` before mass renames. Keep Node running compiled output (or `tsx` only in trusted local/dev paths). Naming an `Env` type still leaves `Number(undefined)` as a runtime `NaN` risk — types do not replace validating process boundaries. The point of the right-hand pane is that green types are not the same as safe runtime values.",
  js: {
    code: `// package.json scripts still run node on .js entrypoints.
function boot(env) {
  return Number(env.PORT);
}

boot({ PORT: "3000" });
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "Keep the runtime entry; add checking beside it.",
  },
  ts: {
    code: `type Env = { PORT?: string };

function boot(env: Env): number {
  return Number(env.PORT);
}

// PORT might be missing — Number(undefined) is NaN.
const port: number = boot({});
if (Number.isNaN(port)) {
  throw new Error("PORT required");
}
`,
    highlights: [{ start: 7, end: 7 }],
    caption:
      "No TypeScript error here — that's the point: naming Env still leaves Number(`undefined`) as a runtime NaN risk.",
    expectedDiagnostics: [],
  },
  insight: [
    "Add typescript as a pinned devDependency (this site dual-installs typescript@7 plus typescript-strada@6.0.3 for createProgram).",
    "Commit a minimal `strict` `tsconfig` before mass renames.",
    "Keep node running compiled or tsx/ts-node only in trusted local/dev paths.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Must you rename all files to `.ts` on day one?",
      choices: [
        { id: "a", text: "Yes" },
        { id: "b", text: "No — `allowJs` lets you adopt gradually" },
        { id: "c", text: "Only for tests" },
        { id: "d", text: "Only for ESM" },
      ],
      answerId: "b",
      explanation: "`allowJs`/`checkJs` are the gradual path.",
    },
  ],
  exercise: {
    prompt: "Require PORT before Number() so NaN cannot escape.",
    starter: `type Env = { PORT?: string };

function boot(env: Env): number {
  return Number(env.PORT);
}

export const port = boot({});
`,
    assertion: "no-errors",
    hints: ["if (!env.PORT) throw ...; return Number(env.PORT)"],
    solution: `type Env = { PORT?: string };

function boot(env: Env): number {
  if (!env.PORT) throw new Error("PORT required");
  return Number(env.PORT);
}

export const port = boot({ PORT: "3000" });
`,
  },
};
