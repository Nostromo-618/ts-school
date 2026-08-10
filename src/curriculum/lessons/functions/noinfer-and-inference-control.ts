import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "noinfer-and-inference-control",
  title: "Steering inference with NoInfer",
  tier: "advanced",
  track: "functions",
  order: 18,
  summary:
    "`NoInfer`<T> tells the checker not to take a candidate from a position — the fix for a default argument that widens the type you were narrowing.",
  prerequisites: ["generic-inference-internals"],
  keywords: ["NoInfer", "inference", "candidate", "default", "generic"],
  problem:
    "One extra argument silently widens T, so an API that validated its input yesterday accepts anything today.",
  js: {
    code: `// JS: defaults just fill in — they also "teach" the type if you imagine one.
function createRoute(path, fallback = "/") {
  return { path: path ?? fallback };
}
createRoute("/home", 0); // weird fallback, no complaint
`,
    highlights: [{ start: 4, end: 4 }],
    caption:
      "Defaults participate in the same untyped soup as other arguments.",
  },
  ts: {
    code: `// Without NoInfer, the fallback argument also infers T and widens it.
function pick<T extends string>(
  value: T,
  fallback: NoInfer<T>,
): T {
  return value ?? fallback;
}

const a = pick("left", "left");
const b = pick("left", "right");
`,
    highlights: [{ start: 9, end: 9 }],
    caption:
      "`NoInfer` blocks candidates from fallback; mismatched literals error.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 10,
        messageIncludes: "right",
      },
    ],
  },
  insight: [
    "Inference sites that should only *check* against T, not *define* T, should be wrapped in `NoInfer`<T>.",
    "Classic cases: default values, secondary arguments, and context that must follow a primary source of truth.",
    "Before `NoInfer`, libraries used crazy double-generic tricks; prefer the built-in now.",
  ],
  quiz: [
    {
      id: "noinfer-q",
      prompt: "What does `NoInfer`<T> do at an inference site?",
      choices: [
        { id: "a", text: "Erases T to `unknown`" },
        {
          id: "b",
          text: "Prevents that position from contributing candidates for T",
        },
        { id: "c", text: "Forces T to be `never`" },
        { id: "d", text: "Disables `strictNullChecks` for T" },
      ],
      answerId: "b",
      explanation:
        "The position is still checked against the inferred T; it just does not help choose T.",
    },
  ],
  exercise: {
    prompt:
      "Write assertEqual<T>(actual: T, expected: `NoInfer`<T>): `void` that only compares, and call it with matching string literals.",
    starter: `function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error("mismatch");
}

assertEqual("a", "a");
`,
    assertion: "no-errors",
    hints: ["actual: T, expected: `NoInfer`<T>"],
    solution: `function assertEqual<T>(actual: T, expected: NoInfer<T>): void {
  if (actual !== expected) throw new Error("mismatch");
}

assertEqual("a", "a");
`,
  },
};
