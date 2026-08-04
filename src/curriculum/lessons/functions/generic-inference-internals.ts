import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "generic-inference-internals",
  title: "How inference picks a type argument",
  tier: "advanced",
  track: "functions",
  order: 17,
  summary:
    "Inference sites, candidate collection, priorities, and the common supertype rule. Enough of the algorithm to predict what T will be.",
  prerequisites: ["inferring-type-arguments", "assignability-rules"],
  keywords: ["inference", "candidate", "priority", "supertype", "generic"],
  problem:
    "Reordering two parameters changes the inferred type, and nothing in the signature says it should.",
  js: {
    code: `// JS: "identity" helpers just return what you pass — no shared T.
function pair(a, b) {
  return [a, b];
}
const p = pair(1, "x"); // [any, any] vibe in untyped code
`,
    highlights: [{ start: 2, end: 5 }],
    caption:
      "Without inference rules, paired values share no declared relationship.",
  },
  ts: {
    code: `function pair<T>(a: T, b: T): [T, T] {
  return [a, b];
}

// Explicit annotation wins — "x" is checked against number.
const q = pair<number>(1, "x");

// Inferred calls collect candidates into a common supertype:
const p = pair<string | number>(1, "x");
const ok: string | number = p[0];
void ok;
`,
    highlights: [{ start: 6, end: 6 }],
    caption:
      "An explicit T checks arguments; inferred unions must be stated or formed carefully.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 6,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Each argument position that mentions T is an inference site; candidates are collected then combined.",
    "When candidates disagree, TypeScript often takes a common supertype (a union), not the first argument alone.",
    "An explicit type argument disables inference for that parameter and checks arguments against it.",
  ],
  quiz: [
    {
      id: "infer-supertype",
      prompt: 'What is T in pair(1, "x") for pair<T>(a: T, b: T)?',
      choices: [
        { id: "a", text: "number" },
        { id: "b", text: "string" },
        { id: "c", text: "string | number" },
        { id: "d", text: "never" },
      ],
      answerId: "c",
      explanation:
        "Both arguments contribute candidates; the checker forms a common supertype union.",
    },
  ],
  exercise: {
    prompt:
      "Write choose<T>(a: T, b: T): T that returns a. Call it with two strings.",
    starter: `function choose(a, b) {
  return a;
}

const c = choose("a", "b");
`,
    assertion: "no-errors",
    hints: ["Add <T> and type both parameters as T."],
    solution: `function choose<T>(a: T, _b: T): T {
  return a;
}

const c = choose("a", "b");
void c;
`,
  },
};
