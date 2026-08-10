import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "ci-gates-for-types",
  title: "Type checking in CI",
  tier: "advanced",
  track: "tooling",
  order: 21,
  summary:
    "Where the check belongs in a pipeline, caching it, and ratcheting an error budget so a partially migrated codebase can only improve.",
  prerequisites: ["type-checking-performance", "suppressions"],
  keywords: ["ci", "gate", "ratchet", "error budget", "cache", "pipeline"],
  problem:
    'Without a type gate, regressions are invisible in CI. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "Type checking in CI" as a CI gate, not a personal preference.',
  solution:
    "Ratchet gates compare counts — over budget is false. Put `tsc` --`noEmit` early in CI; cache .tsbuildinfo when using incremental/project references. Ratchets encode a budget; tighten maxErrors over time. Do not let suppressions grow unbounded — count @ts-expect-error too. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `// JS CI often runs tests only — type errors never appear.
console.log("shipped");
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Without a type gate, regressions are invisible in CI.",
  },
  ts: {
    code: `type GateResult = { errors: number; maxErrors: number };

function passes(gate: GateResult): boolean {
  return gate.errors <= gate.maxErrors;
}

const migrating: GateResult = { errors: 380, maxErrors: 400 };
const ok = passes(migrating);

const broken: GateResult = { errors: 401, maxErrors: 400 };
const claim: true = passes(broken);
void ok;
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Ratchet gates compare counts — over budget is false.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 11,
        messageIncludes: "boolean",
      },
    ],
  },
  insight: [
    "Put `tsc` --`noEmit` early in CI; cache .tsbuildinfo when using incremental/project references.",
    "Ratchets encode a budget; tighten maxErrors over time.",
    "Do not let suppressions grow unbounded — count @ts-expect-error too.",
  ],
  quiz: [
    {
      id: "ci-q",
      prompt: "Best CI strategy for a half-migrated repo?",
      choices: [
        { id: "a", text: "Disable typecheck until migration finishes" },
        { id: "b", text: "Ratchet error counts so they cannot increase" },
        { id: "c", text: "Only typecheck on Fridays" },
        { id: "d", text: "Rely on editor squiggles" },
      ],
      answerId: "b",
      explanation:
        "Budgets allow progress without blocking every PR on historical debt.",
    },
  ],
  exercise: {
    prompt: "Write passes(errors: number, max: number): boolean.",
    starter: `function passes(errors: number, max: number) {
  return errors <= max;
}
`,
    assertion: "no-errors",
    hints: ["Annotate the return as boolean."],
    solution: `function passes(errors: number, max: number): boolean {
  return errors <= max;
}
void passes(1, 2);
`,
  },
};
