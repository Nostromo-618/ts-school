import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "unknown-vs-any",
  title: "unknown against any",
  tier: "beginner",
  track: "runtime-boundary",
  order: 1,
  summary:
    "`unknown` is the type-safe top type: you must narrow before use. `any` disables checking. Prefer `unknown` at boundaries.",
  prerequisites: ["any-and-implicit-any"],
  keywords: ["unknown", "any", "top type", "narrowing"],
  problem:
    "Typing inbound JSON as `any` lets every property access compile — including ones that will throw.",
  js: {
    code: `function upper(value) {
  return value.toUpperCase();
}

upper(JSON.parse("42"));
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "No check that value is a string.",
  },
  ts: {
    code: `function upper(value: unknown): string {
  return value.toUpperCase();
}
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "`unknown` forbids property access until you narrow.",
    expectedDiagnostics: [{ code: 18046, line: 2, messageIncludes: "unknown" }],
  },
  insight: [
    "`any` is contagious; `unknown` forces a decision at each use site.",
    "Narrow `unknown` with `typeof`, `Array.isArray`, or custom predicates.",
    "Library boundaries should accept `unknown` (or generics), not any.",
  ],
  security: {
    title: "Prefer unknown for untrusted values",
    body: "Replacing `any` with `unknown` at request bodies and parse results restores the requirement to validate before use.",
    severity: "critical",
  },
  quiz: [
    {
      id: "q1",
      prompt: "What must you do before calling methods on `unknown`?",
      choices: [
        { id: "a", text: "Nothing" },
        { id: "b", text: "Narrow it to a more specific type" },
        { id: "c", text: "Wrap it in Promise" },
        { id: "d", text: "Export it" },
      ],
      answerId: "b",
      explanation: "`unknown` is not yet a usable value type.",
    },
  ],
  exercise: {
    prompt: "Narrow with `typeof` before toUpperCase.",
    starter: `function upper(value: unknown): string {
  return value.toUpperCase();
}
`,
    assertion: "no-errors",
    hints: [
      'if (`typeof` value === "string") return value.toUpperCase(); return "";',
    ],
    solution: `function upper(value: unknown): string {
  if (typeof value === "string") return value.toUpperCase();
  return "";
}
`,
  },
};
