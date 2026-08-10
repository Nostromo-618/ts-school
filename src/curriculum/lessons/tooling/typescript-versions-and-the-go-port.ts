import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typescript-versions-and-the-go-port",
  title: "TypeScript 6, 7, and the Go port",
  tier: "advanced",
  track: "tooling",
  order: 22,
  summary:
    "What the native port changes, what it removes — including the in-browser programmatic API — and how this site dual-installs Strada for build-time diagnostics alongside typescript@7.",
  prerequisites: ["tsc-compiler-pipeline", "bundlers-and-transpile-only"],
  keywords: [
    "typescript 7",
    "go",
    "native",
    "compiler api",
    "tsgo",
    "strada",
    "migration",
  ],
  problem:
    "TypeScript 7 is a native binary with no JavaScript createProgram API yet, so tools that embed the compiler need a dual-install strategy.",
  js: {
    code: `// Native compilers are CLIs — not importable JS libraries.
// Embedding tsc in a browser worker needs a JS API that TS 7 does not ship.
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
    caption:
      "This site uses typescript@7 for tooling CLI and typescript-strada@6 for build-time diagnostics.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 21,
        messageIncludes: "boolean",
      },
    ],
  },
  insight: [
    "TypeScript 7 is the primary package here (native CLI); Strada 6 stays as typescript-strada for createProgram.",
    "Microsoft publishes the Strada API line as `@typescript/typescript6`; this site aliases it `typescript-strada` for build-time diagnostics.",
    "Lesson diagnostics are generated at build time — the browser never ships a compiler.",
    "Plan editor/CI native speedups separately from tools that still need the JS Compiler API.",
  ],
  quiz: [
    {
      id: "go-q",
      prompt: "How does ts-school use TypeScript 7 today?",
      choices: [
        {
          id: "a",
          text: "It runs createProgram in a Web Worker from typescript@7",
        },
        {
          id: "b",
          text: "typescript@7 for tooling; typescript-strada@6 for build-time diagnostics",
        },
        { id: "c", text: "It refuses to install typescript@7" },
        { id: "d", text: "Only ESLint uses 7; everything else stays on 5" },
      ],
      answerId: "b",
      explanation:
        "The native package has no browser createProgram API yet, so diagnostics are produced in Node with Strada and shipped as static data.",
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
