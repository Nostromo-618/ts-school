import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "annotations-vs-inference",
  title: "Annotations against inference",
  tier: "beginner",
  track: "foundations",
  order: 4,
  summary:
    "When to write the type yourself and when to let TypeScript `infer it` — and the quiet ways inference can widen further than you meant.",
  prerequisites: ["types-are-erased"],
  keywords: ["inference", "annotation", "let", "const", "explicit types"],
  problem:
    "Annotating everything is noise; annotating nothing lets a string slip into a number-shaped hole after a refactor. Look at the left pane: without types, string | number collapses into 'whatever'. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Annotate or parse when inference widens past the API. Prefer inference for locals whose initializer already states the type clearly. Annotate function parameters, public returns, and values that cross module boundaries. When inference produces a union you did not want, fix the initializer or add an annotation — do not silence with `any`. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
  js: {
    code: `function createServer(port) {
  return { listen: () => port };
}

// Env vars are strings; mixing with a numeric default is a classic footgun.
function listen(envPort) {
  const port = envPort ?? 3000;
  return createServer(port);
}

listen("3000");
`,
    highlights: [{ start: 7, end: 8 }],
    caption: "Without types, string | number collapses into 'whatever'.",
  },
  ts: {
    code: `function createServer(port: number) {
  return { listen: () => port };
}

function listen(envPort: string | undefined) {
  // Inferred as string | number — not assignable to number.
  const port = envPort ?? 3000;
  return createServer(port);
}

listen("3000");
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Annotate or parse when inference widens past the API.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 8,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Prefer inference for locals whose initializer already states the type clearly.",
    "Annotate function parameters, public returns, and values that cross module boundaries.",
    "When inference produces a union you did not want, fix the initializer or add an annotation — do not silence with `any`.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Where should you almost always write type annotations?",
      choices: [
        { id: "a", text: "Every const inside a function" },
        { id: "b", text: "Function parameters and exported APIs" },
        { id: "c", text: "Only inside .d.ts files" },
        { id: "d", text: "Never — inference is always enough" },
      ],
      answerId: "b",
      explanation:
        "Boundaries need contracts. Locals can usually be inferred from their initializer.",
    },
  ],
  exercise: {
    prompt: "Parse envPort to a number before calling createServer.",
    starter: `function createServer(port: number) {
  return { listen: () => port };
}

function listen(envPort: string | undefined) {
  const port = envPort ?? 3000;
  return createServer(port);
}

listen("3000");
`,
    assertion: "no-errors",
    hints: ["envPort === `undefined` ? 3000 : Number(envPort)"],
    solution: `function createServer(port: number) {
  return { listen: () => port };
}

function listen(envPort: string | undefined) {
  const port = envPort === undefined ? 3000 : Number(envPort);
  return createServer(port);
}

listen("3000");
`,
  },
};
