import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "floating-promises-and-void",
  title: "Floating promises",
  tier: "advanced",
  track: "async",
  order: 15,
  summary:
    "An un-awaited promise is a lost rejection — and on modern Node, a crashed process. Know what `void` is for.",
  prerequisites: ["void-returning-callbacks", "async-await-typing"],
  keywords: [
    "floating promise",
    "no-floating-promises",
    "void operator",
    "unhandled rejection",
  ],
  problem:
    "A background `write()` is kicked off without `await` or `.catch`. When the disk fills, the rejection becomes unhandled and — since Node 15's default — can take the whole process down. The failure mode is not a type error TypeScript reports by itself; it is an availability incident caused by a floating promise nobody owned.",
  solution:
    "Prefer `await` inside `async` functions so rejections stay on a path you handle. TypeScript will not always error on floating promises; `@typescript-eslint/no-floating-promises` will. Use the `void` operator only as the intentional escape hatch those rules recognize when something else handles the rejection. The TypeScript pane also reminds you that `Promise<void>` is not assignable to `string` — fire-and-forget is about ownership, not about pretending a promise is a value.",
  js: {
    code: `// JS: fire-and-forget is easy — and rejects crash Node.
async function write(path, data) {
  throw new Error("disk full");
}
write("/tmp/x", "hi"); // floating — rejection may be unhandled
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "A forgotten `await` is a process-level hazard on modern Node.",
  },
  ts: {
    code: `async function write(_path: string, _data: string): Promise<void> {
  throw new Error("disk full");
}

async function main() {
  // Floating promise: callers should await or explicitly void.
  write("/tmp/x", "hi");
  await write("/tmp/y", "ok");
}

// void marks intentional fire-and-forget for lint rules.
void write("/tmp/z", "bg");

const p: Promise<void> = main();
const wrong: string = p;
`,
    highlights: [{ start: 15, end: 15 }],
    caption:
      "`Promise<void>` is not a string — and floating calls need an owner.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 15,
        messageIncludes: "Promise",
      },
    ],
  },
  insight: [
    "TypeScript itself does not error on floating promises; @typescript-eslint/no-floating-promises does.",
    "`void` promise is the intentional escape hatch those rules recognize.",
    "Prefer await in async functions; only `void` when the rejection is handled elsewhere.",
  ],
  security: {
    title: "Unhandled rejections and availability",
    body: "An unhandled rejection can terminate the process (Node’s default). That is an availability failure — treat floating promises as production bugs.",
    severity: "caution",
  },
  quiz: [
    {
      id: "float-q",
      prompt: "What is the `void` operator used for with promises?",
      choices: [
        { id: "a", text: "Cancel the promise" },
        {
          id: "b",
          text: "Mark intentional ignore for floating-promise lint rules",
        },
        { id: "c", text: "Convert Promise to `void` at runtime" },
        { id: "d", text: "Force await" },
      ],
      answerId: "b",
      explanation:
        "`void` promise tells linters you meant to discard the `Promise`.",
    },
  ],
  exercise: {
    prompt:
      "Write async function run(): `Promise<number>` that returns 1, and await it in main.",
    starter: `async function run() {
  return 1;
}
async function main() {
  run();
}
`,
    assertion: "no-errors",
    hints: ["await run(); annotate return types."],
    solution: `async function run(): Promise<number> {
  return 1;
}
async function main(): Promise<void> {
  await run();
}
void main();
`,
  },
};
