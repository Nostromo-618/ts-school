import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "tsc-cli",
  title: "The tsc command line",
  tier: "beginner",
  track: "tooling",
  order: 1,
  summary:
    "`tsc` --`noEmit` for CI typechecking, `tsc` for emit, and why the flags you pass must match the `tsconfig` the editor uses.",
  prerequisites: ["tsconfig-essentials"],
  keywords: ["tsc", "CLI", "noEmit", "CI"],
  problem:
    'Without `tsc` in CI, string concatenation ships. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "The tsc command line" as a CI gate, not a personal preference.',
  solution:
    "What `tsc -p . --noEmit` should fail on in CI. Use `tsc` --`noEmit` (or -b --pretty false) as the CI type gate. Prefer project flags via `tsconfig` over long ad-hoc CLI lists. Pin TypeScript so local, editor, and CI agree — this site uses typescript@7 for the CLI and typescript-strada@6.0.3 where createProgram is required. The dual panes are the lesson: left fails, right refuses.",
  js: {
    code: `// "It works when I run node" is not a typecheck.
function add(a, b) {
  return a + b;
}
add(1, "2");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Without `tsc` in CI, string concatenation ships.",
  },
  ts: {
    code: `function add(a: number, b: number): number {
  return a + b;
}

add(1, "2");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "What `tsc -p . --noEmit` should fail on in CI.",
    expectedDiagnostics: [{ code: 2345, line: 5, messageIncludes: "string" }],
  },
  insight: [
    "Use `tsc` --`noEmit` (or -b --pretty false) as the CI type gate.",
    "Prefer project flags via `tsconfig` over long ad-hoc CLI lists.",
    "Pin TypeScript so local, editor, and CI agree — this site uses typescript@7 for the CLI and typescript-strada@6.0.3 where createProgram is required.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does --`noEmit` do?",
      choices: [
        { id: "a", text: "Skips typechecking" },
        { id: "b", text: "Typechecks without writing JS output" },
        { id: "c", text: "Deletes dist/" },
        { id: "d", text: "Enables emit of .d.ts only" },
      ],
      answerId: "b",
      explanation: "CI usually wants check-only.",
    },
  ],
  exercise: {
    prompt: "Call add with two numbers.",
    starter: `function add(a: number, b: number): number {
  return a + b;
}

add(1, "2");
`,
    assertion: "no-errors",
    hints: ["add(1, 2)"],
    solution: `function add(a: number, b: number): number {
  return a + b;
}

add(1, 2);
`,
  },
};
