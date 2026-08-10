import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "strictnullchecks",
  title: "strictNullChecks",
  tier: "intermediate",
  track: "tooling",
  order: 6,
  summary:
    "The rung that pays for the whole migration. What it flags, why the error count is front-loaded, and the patterns that clear it fastest.",
  prerequisites: ["the-strictness-ladder", "null-and-undefined"],
  keywords: ["strictNullChecks", "null", "undefined", "flag", "migration"],
  problem:
    "`len(null)` reads `.length` and crashes — or, with coerced values, corrupts a downstream string API. Without `strictNullChecks`, `null` and `undefined` slide into ordinary types and the checker stays quiet until runtime. Keep the flag in CI so new files cannot regress the guarantee.",
  solution:
    "With `strictNullChecks` (included in `strict: true`), `null` is not a `string` — the TypeScript pane rejects `len(null)`. Write unions explicitly when absence is allowed (`string | null`) and narrow before use. Turn the flag on as a CI gate: the error count is front-loaded; leaving it off reintroduces the same crashes in every new file.",
  js: {
    code: `function len(s) { return s.length; }
len(null);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "`null` slides into string APIs.",
  },
  ts: {
    code: `function len(s: string): number {
  return s.length;
}
len(null);
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "With `strictNullChecks`, `null` is not string.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 4,
        messageIncludes: "Argument of type 'null' is not assignable to par",
      },
    ],
  },
  insight: [
    "`strictNullChecks` makes `null`/`undefined` illicit for ordinary types.",
    "It is included in `strict`: true — keep it on.",
    "Use unions explicitly when absence is allowed.",
  ],
  security: {
    title: "null crashes are also auth gaps",
    body: "Passing `null` into a string-typed userId or token path often means “no session” at runtime. With the flag off, those calls type-check; with it on, you must model absence and reject unauthenticated requests explicitly.",
    severity: "caution",
  },
  quiz: [
    {
      id: "q1",
      prompt: "With `strictNullChecks`, is `null` assignable to string?",
      choices: [
        { id: "a", text: "Yes — `null` is a valid string value" },
        { id: "b", text: "No — use string | `null` when absence is allowed" },
        { id: "c", text: "Only inside classes" },
        { id: "d", text: "Only for optional properties" },
      ],
      answerId: "b",
      explanation:
        "Ordinary types exclude `null` and `undefined`; write the union when you mean absence.",
    },
  ],
};
