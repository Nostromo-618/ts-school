import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "the-strictness-ladder",
  title: "The strictness ladder",
  tier: "beginner",
  track: "tooling",
  order: 4,
  summary:
    "Turn on strict flags in a sensible order for a brownfield Node app — measure errors, fix, then climb.",
  prerequisites: ["strict-mode", "tsc-cli"],
  keywords: ["strict", "noImplicitAny", "strictNullChecks", "migration"],
  problem:
    'Enabling "strict": true on a million-line repo produces 40k errors and a revert by Friday.',
  js: {
    code: `function len(s) {
  return s.length;
}
len(undefined);
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "Each strict flag targets a class of this bug.",
  },
  ts: {
    code: `function len(s: string): number {
  return s.length;
}

len(undefined);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "strictNullChecks is usually the highest-value early climb.",
    expectedDiagnostics: [
      { code: 2345, line: 5, messageIncludes: "undefined" },
    ],
  },
  insight: [
    "Suggested order: noImplicitAny → strictNullChecks → strictFunctionTypes → full strict.",
    "Track error counts per flag in CI so progress is visible.",
    'Never "fix" a flag by sprinkling any — that climbs down the ladder.',
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why climb one flag at a time?",
      choices: [
        { id: "a", text: "TypeScript only allows one flag" },
        {
          id: "b",
          text: "Error volume stays reviewable and the app keeps shipping",
        },
        { id: "c", text: "Flags conflict and cannot combine" },
        { id: "d", text: "CI cannot run multiple flags" },
      ],
      answerId: "b",
      explanation: "Incremental strictness is a migration strategy.",
    },
  ],
  exercise: {
    prompt: "Accept undefined safely.",
    starter: `function len(s: string): number {
  return s.length;
}

len(undefined);
`,
    assertion: "no-errors",
    hints: ["s?: string; return s?.length ?? 0"],
    solution: `function len(s?: string): number {
  return s?.length ?? 0;
}

len(undefined);
`,
  },
};
