import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-checking-performance",
  title: "When the checker gets slow",
  tier: "advanced",
  track: "tooling",
  order: 20,
  summary:
    "--diagnostics, --generateTrace, and the analyser: finding the type, the file, or the dependency that is costing you thirty seconds.",
  prerequisites: ["type-level-performance", "incremental-builds"],
  keywords: [
    "performance",
    "generateTrace",
    "diagnostics",
    "slow",
    "profiling",
  ],
  problem:
    "Compile times grow gradually until the editor is unusable, and by then nobody knows which change caused it. Look at the left pane: checker cost is invisible until the editor lags. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Heavy slowdowns call for generateTrace, not vibes. Start with `tsc` --diagnostics / --extendedDiagnostics for counts and timings. generateTrace + @typescript/analyze-trace finds hot files and types. Fix shared package types and giant unions before buying bigger CI machines. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
  js: {
    code: `// JS build slowness is usually transform/bundle — profile with different tools.
// TypeScript slowness is often checker instantiation, not emit.
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Checker cost is invisible until the editor lags.",
  },
  ts: {
    code: `type TraceHint = "diagnostics" | "generateTrace" | "extendedDiagnostics";

function recommend(slow: boolean): TraceHint {
  return slow ? "generateTrace" : "diagnostics";
}

const hint = recommend(true);
const wrong: "diagnostics" = recommend(true);
void hint;
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Heavy slowdowns call for generateTrace, not vibes.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 8,
        messageIncludes: "generateTrace",
      },
    ],
  },
  insight: [
    "Start with `tsc` --diagnostics / --extendedDiagnostics for counts and timings.",
    "generateTrace + @typescript/analyze-trace finds hot files and types.",
    "Fix shared package types and giant unions before buying bigger CI machines.",
  ],
  quiz: [
    {
      id: "perf-tool",
      prompt: "Which flag produces a trace for the analyser?",
      choices: [
        { id: "a", text: "--pretty" },
        { id: "b", text: "--generateTrace" },
        { id: "c", text: "--`skipLibCheck`" },
        { id: "d", text: "--`noEmit`" },
      ],
      answerId: "b",
      explanation:
        "--generateTrace writes performance trace data for analysis tools.",
    },
  ],
  exercise: {
    prompt:
      "Type Metric = { checkTimeMs: number } and a function slower(a, b) comparing checkTimeMs.",
    starter: `type Metric = { checkTimeMs: number };
function slower(a: Metric, b: Metric): Metric {
  return a;
}
`,
    assertion: "no-errors",
    hints: ["return the one with larger checkTimeMs"],
    solution: `type Metric = { checkTimeMs: number };
function slower(a: Metric, b: Metric): Metric {
  return a.checkTimeMs >= b.checkTimeMs ? a : b;
}
void slower({ checkTimeMs: 10 }, { checkTimeMs: 20 });
`,
  },
};
