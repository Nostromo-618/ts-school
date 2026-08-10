import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "tsc-compiler-pipeline",
  title: "What tsc actually does",
  tier: "advanced",
  track: "foundations",
  order: 16,
  summary:
    "Scanner, parser, binder, checker, emitter — and where a Program, a SourceFile, and a TypeChecker sit. This site runs Strada createProgram in the diagnostic generator and CI, not in the browser.",
  prerequisites: [
    "type-space-vs-value-space",
    "erasable-syntax-and-type-stripping",
  ],
  keywords: ["compiler", "binder", "checker", "program", "AST", "compiler api"],
  problem:
    "Treating the compiler as a black box makes its performance characteristics and its error messages equally mysterious. Look at the left pane: transpile-only pipelines skip the checker TypeScript spends time in. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "Checker diagnostics exist without emit — generator/CI mode uses `noEmit`. `Program` owns `SourceFile`s; `TypeChecker` answers type questions after bind. Errors can originate in parse, bind, or check — the code number hints which family. Emit is optional: `noEmit` / transpile-only tools skip or replace the checker. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
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

// Build-time Strada createProgram stops before emit: noEmit + diagnostics only.
function typecheckOnly(stages: Stage[]): Stage[] {
  return stages.filter((s) => s !== "emit");
}

const generatorStages = typecheckOnly(pipeline);
const wrong: "emit" = generatorStages[0];
`,
    highlights: [{ start: 16, end: 16 }],
    caption:
      "Checker diagnostics exist without emit — generator/CI mode uses `noEmit`.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "emit",
      },
    ],
  },
  insight: [
    "`Program` owns `SourceFile`s; `TypeChecker` answers type questions after bind.",
    "Errors can originate in parse, bind, or check — the code number hints which family.",
    "Emit is optional: `noEmit` / transpile-only tools skip or replace the checker.",
  ],
  diagram: {
    version: "1.2.0",
    viewport: { x: 0, y: 0, scale: 1 },
    nodes: [
      {
        id: "scan",
        type: "rounded-rect",
        x: 0,
        y: 40,
        width: 140,
        height: 72,
        text: "Scan",
        data: {},
      },
      {
        id: "parse",
        type: "rounded-rect",
        x: 180,
        y: 40,
        width: 140,
        height: 72,
        text: "Parse",
        data: {},
      },
      {
        id: "bind",
        type: "rounded-rect",
        x: 360,
        y: 40,
        width: 140,
        height: 72,
        text: "Bind",
        data: {},
      },
      {
        id: "check",
        type: "rounded-rect",
        x: 540,
        y: 40,
        width: 140,
        height: 72,
        text: "Check",
        data: {},
      },
      {
        id: "emit",
        type: "rounded-rect",
        x: 720,
        y: 40,
        width: 140,
        height: 72,
        text: "Emit",
        data: {},
      },
    ],
    edges: [
      {
        id: "e1",
        from: { nodeId: "scan", port: "right" },
        to: { nodeId: "parse", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "",
        data: {},
      },
      {
        id: "e2",
        from: { nodeId: "parse", port: "right" },
        to: { nodeId: "bind", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "",
        data: {},
      },
      {
        id: "e3",
        from: { nodeId: "bind", port: "right" },
        to: { nodeId: "check", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "",
        data: {},
      },
      {
        id: "e4",
        from: { nodeId: "check", port: "right" },
        to: { nodeId: "emit", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "optional",
        data: {},
      },
    ],
  },
  quiz: [
    {
      id: "pipe-q",
      prompt: "Which stage assigns symbols and builds the scope graph?",
      choices: [
        { id: "a", text: "scan" },
        { id: "b", text: "bind" },
        { id: "c", text: "emit" },
        { id: "d", text: "`package.json`" },
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
