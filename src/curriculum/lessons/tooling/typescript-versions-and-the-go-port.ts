import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typescript-versions-and-the-go-port",
  title: "TypeScript 6, 7, and the Go port",
  tier: "advanced",
  track: "tooling",
  order: 22,
  summary:
    "What the native port changes, what it removes — including the programmatic API this very site runs in a Web Worker — and how to plan for it.",
  prerequisites: ["tsc-compiler-pipeline", "bundlers-and-transpile-only"],
  keywords: [
    "typescript 7",
    "go",
    "native",
    "compiler api",
    "tsgo",
    "migration",
  ],
  problem:
    "TypeScript 7 is a native binary with no JavaScript API, so every tool built on the compiler has to wait for a new one.",
  js: {
    code: `// Native compilers are CLIs — not importable JS libraries.
// Browser-hosted checkers need a JS API that TS 7 does not ship.
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "No JS API means no in-browser tsc from the native port.",
  },
  ts: {
    code: `type CompilerKind = "strada-js" | "native-go";

type Capability = {
  kind: CompilerKind;
  programmaticApi: boolean;
  browserWorker: boolean;
};

const ts6: Capability = {
  kind: "strada-js",
  programmaticApi: true,
  browserWorker: true,
};

const ts7: Capability = {
  kind: "native-go",
  programmaticApi: false,
  browserWorker: false,
};

const canWorker: true = ts7.browserWorker;
void ts6;
`,
    highlights: [{ start: 20, end: 20 }],
    caption: "This site pins 6.0.3 because workers need the JS API.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 21,
        messageIncludes: "boolean",
      },
    ],
  },
  insight: [
    "TypeScript 6.x remains the last Strada/JS compiler API line for in-process checking.",
    "Plan editor/CI native speedups separately from tools that embed typescript as a library.",
    "Pin versions deliberately — “latest” may remove the API your tooling imports.",
  ],
  quiz: [
    {
      id: "go-q",
      prompt: "Why does ts-school pin typescript@6.0.3?",
      choices: [
        { id: "a", text: "6 is faster than 7 in every benchmark" },
        { id: "b", text: "6 still provides a JS programmatic API for the worker" },
        { id: "c", text: "7 cannot run on macOS" },
        { id: "d", text: "pnpm forbids 7" },
      ],
      answerId: "b",
      explanation:
        "The in-browser worker imports typescript; TS 7’s native port has no such API yet.",
    },
  ],
  exercise: {
    prompt:
      "Type Cap = { programmaticApi: boolean } and const ts6: Cap = { programmaticApi: true }.",
    starter: `type Cap = { programmaticApi: boolean };
const ts6 = { programmaticApi: true };
`,
    assertion: "no-errors",
    hints: ["Annotate const ts6: Cap"],
    solution: `type Cap = { programmaticApi: boolean };
const ts6: Cap = { programmaticApi: true };
void ts6;
`,
  },
};
