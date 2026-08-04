import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "tsc-compiler-pipeline",
  title: "What tsc actually does",
  tier: "advanced",
  track: "foundations",
  order: 16,
  summary:
    "Scanner, parser, binder, checker, emitter — and where a Program, a SourceFile, and a TypeChecker sit. The same API this site runs in a Web Worker.",
  prerequisites: [
    "type-space-vs-value-space",
    "erasable-syntax-and-type-stripping",
  ],
  keywords: ["compiler", "binder", "checker", "program", "AST", "compiler api"],
  problem:
    "Treating the compiler as a black box makes its performance characteristics and its error messages equally mysterious.",
  js: {
    code: `// JS tooling often "compiles" by parsing+emitting only (esbuild/swc).
// That pipeline has no checker stage — types are deleted, not proven.
function add(a, b) {
  return a + b;
}
`,
    highlights: [{ start: 1, end: 2 }],
    caption:
      "Transpile-only pipelines skip the checker TypeScript spends time in.",
  },
  ts: {
    code: `// Mental model of stages (illustrative — not the real API surface):
type Stage =
  | "scan"
  | "parse"
  | "bind"
  | "check"
  | "emit";

const pipeline: Stage[] = ["scan", "parse", "bind", "check", "emit"];

// This site's worker stops before emit: noEmit + diagnostics only.
function typecheckOnly(stages: Stage[]): Stage[] {
  return stages.filter((s) => s !== "emit");
}

const workerStages = typecheckOnly(pipeline);
const wrong: "emit" = workerStages[0];
`,
    highlights: [{ start: 16, end: 16 }],
    caption: "Checker diagnostics exist without emit — the worker’s mode.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "emit",
      },
    ],
  },
  insight: [
    "Program owns SourceFiles; TypeChecker answers type questions after bind.",
    "Errors can originate in parse, bind, or check — the code number hints which family.",
    "Emit is optional: `noEmit` / transpile-only tools skip or replace the checker.",
  ],
  quiz: [
    {
      id: "pipe-q",
      prompt: "Which stage assigns symbols and builds the scope graph?",
      choices: [
        { id: "a", text: "scan" },
        { id: "b", text: "bind" },
        { id: "c", text: "emit" },
        { id: "d", text: "package.json" },
      ],
      answerId: "b",
      explanation:
        "The binder links identifiers to declarations before the checker runs.",
    },
  ],
  exercise: {
    prompt:
      'Define type Phase = "parse" | "check" and a function that accepts only "check".',
    starter: `type Phase = "parse" | "check";
function runCheck(p: Phase) {
  void p;
}
`,
    assertion: "no-errors",
    hints: ['Narrow the parameter to the "check" literal.'],
    solution: `type Phase = "parse" | "check";
function runCheck(p: "check") {
  void p;
}
runCheck("check");
`,
  },
};
