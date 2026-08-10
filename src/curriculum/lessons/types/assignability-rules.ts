import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "assignability-rules",
  title: "The assignability rules",
  tier: "advanced",
  track: "types",
  order: 24,
  summary:
    "What the checker actually asks when it asks whether A fits B: top and bottom types, union and intersection reduction, and the special cases for `any`.",
  prerequisites: [
    "control-flow-analysis",
    "void-and-never",
    "structural-typing",
  ],
  keywords: [
    "assignability",
    "subtyping",
    "any",
    "unknown",
    "never",
    "reduction",
  ],
  problem:
    "Dynamic assignment has no structural subtype check. The type system is supposed to make that state unrepresentable — if it does not, callers invent ad-hoc checks and still miss a branch. Model the domain so the illegal mix cannot be constructed. Prefer a model where the illegal state cannot be written down.",
  solution:
    "`unknown` cannot flow into string without narrowing. Assignability is structural: members of the target must be present (with compatible types) on the source. `any` is assignable to and from almost everything — it punches through the lattice. `unknown` is the safe top; `never` is the bottom; unions/intersections reduce before the check. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `// JS: assignability is “did it run?” — anything goes.
let x = 1;
x = "now a string";
x = { oops: true };
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "Dynamic assignment has no structural subtype check.",
  },
  ts: {
    code: `// unknown is a safe top: nothing without narrowing.
let u: unknown = 1;
const s: string = u;

// never is bottom: assignable to everything, nothing assignable to it (except never).
function fail(): never {
  throw new Error("nope");
}

const n: number = fail();
void n;
`,
    highlights: [{ start: 3, end: 3 }],
    caption: "`unknown` cannot flow into string without narrowing.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 3,
        messageIncludes: "unknown",
      },
    ],
  },
  insight: [
    "Assignability is structural: members of the target must be present (with compatible types) on the source.",
    "`any` is assignable to and from almost everything — it punches through the lattice.",
    "`unknown` is the safe top; `never` is the bottom; unions/intersections reduce before the check.",
  ],
  quiz: [
    {
      id: "assign-unknown",
      prompt: "Is `unknown` assignable to string?",
      choices: [
        { id: "a", text: "Yes, always" },
        { id: "b", text: "No — you must narrow first" },
        { id: "c", text: "Only with `strictNullChecks` off" },
        { id: "d", text: "Only in .d.ts files" },
      ],
      answerId: "b",
      explanation:
        "`unknown` requires narrowing (or a deliberate assertion) before use as string.",
    },
  ],
  exercise: {
    prompt: "Accept `unknown` and return a string by narrowing with `typeof`.",
    starter: `function asString(x: unknown): string {
  return x as string;
}
`,
    assertion: "no-errors",
    hints: ['if (`typeof` x === "string") return x; else return "";'],
    solution: `function asString(x: unknown): string {
  if (typeof x === "string") return x;
  return "";
}
`,
  },
};
