import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "noimplicitany",
  title: "noImplicitAny",
  tier: "intermediate",
  track: "tooling",
  order: 5,
  summary:
    "The first rung: make the checker complain when it had to guess. Usually the biggest single error count and the biggest single payoff.",
  prerequisites: ["the-strictness-ladder", "any-and-implicit-any"],
  keywords: ["noImplicitAny", "implicit any", "parameters", "strict", "flag"],
  problem:
    "Without it, every unannotated parameter is `any`, and a file can be fully typed on paper and unchecked in practice.",
  js: {
    code: `function add(a, b) { return a + b; }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "`Parameters` silently become `any`.",
  },
  ts: {
    code: `function add(a, b) {
  return a + b;
}
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "`noImplicitAny` (via `strict`) errors on untyped parameters.",
    expectedDiagnostics: [
      {
        code: 7006,
        line: 1,
        messageIncludes: "Parameter 'a' implicitly has an 'any' type.",
      },
      {
        code: 7006,
        line: 1,
        messageIncludes: "Parameter 'b' implicitly has an 'any' type.",
      },
    ],
  },
  insight: [
    "Untyped parameters become implicit `any` without the flag.",
    "Annotate or use contextual typing from callers.",
    "Turn this on early in a migration.",
  ],
  security: {
    title: "Implicit any skips authorization shapes",
    body: "An untyped req, user, or payload parameter is `any` under the hood — roles, ids, and nested objects are never checked. Turn on `noImplicitAny` so boundary handlers cannot quietly accept attacker-controlled shapes.",
    severity: "critical",
  },
  exercise: {
    prompt: "Annotate a and b as number so Check matches the solution text.",
    starter: `function add(a, b) {
  return a + b;
}
`,
    assertion: "no-errors",
    hints: ["function add(a: number, b: number): number"],
    solution: `function add(a: number, b: number): number {
  return a + b;
}
`,
  },
};
