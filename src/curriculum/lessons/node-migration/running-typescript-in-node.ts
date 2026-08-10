import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "running-typescript-in-node",
  title: "Actually running the thing",
  tier: "beginner",
  track: "node-migration",
  order: 6,
  summary:
    "Emit with `tsc`, or run with a loader/tsx in development — know what belongs in production versus local loops.",
  prerequisites: ["adding-typescript-to-an-existing-project", "tsc-cli"],
  keywords: ["tsx", "ts-node", "emit", "production", "node"],
  problem:
    'Runtime should execute trusted emit, not an ad-hoc transform. Migration does not change Node\'s runtime — it surfaces the unions and module edges you already had to handle. Fix the seam "Actually running the thing" names before you rename the next hundred files.',
  solution:
    "Catch entry mistakes before `any` runner ships them. Production: compile with `tsc` (or a bundler) and run the JS output. Local: tsx / node --import tsx are fine for DX; keep them out of prod images. Match module settings (nodenext/bundler) to how you actually launch Node. Let inference work locally; annotate what crosses modules.",
  js: {
    code: `// Prod still needs plain JS (or a compiled artifact).
function main() {
  return "ok";
}
main();
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Runtime should execute trusted emit, not an ad-hoc transform.",
  },
  ts: {
    code: `export function main(): string {
  return "ok";
}

// Demonstrates a typed entry — emit or a trusted runner executes this.
const status: number = main();
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Catch entry mistakes before `any` runner ships them.",
    expectedDiagnostics: [{ code: 2322, line: 6, messageIncludes: "string" }],
  },
  insight: [
    "Production: compile with `tsc` (or a bundler) and run the JS output.",
    "Local: tsx / node --import tsx are fine for DX; keep them out of prod images.",
    "Match module settings (nodenext/bundler) to how you actually launch Node.",
  ],
  security: {
    title: "Do not compile untrusted TypeScript in production",
    body: "Running a TypeScript transform over user-influenced paths or plugins expands attack surface. Ship precompiled artifacts.",
    severity: "caution",
  },
  quiz: [
    {
      id: "q1",
      prompt: "Preferred production approach?",
      choices: [
        { id: "a", text: "ts-node in the container CMD" },
        { id: "b", text: "Compile ahead of time; run JavaScript" },
        { id: "c", text: "Eval TypeScript strings" },
        { id: "d", text: "Skip types in CI" },
      ],
      answerId: "b",
      explanation: "Emit once, run stable JS.",
    },
  ],
  exercise: {
    prompt: "Assign main() to a string-typed binding.",
    starter: `export function main(): string {
  return "ok";
}

const status: number = main();
`,
    assertion: "no-errors",
    hints: ["const status: string = main()"],
    solution: `export function main(): string {
  return "ok";
}

const status: string = main();
void status;
`,
  },
};
