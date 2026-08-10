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
    "Cannot read properties of `undefined` is the most common runtime error in Node, and this is the flag that finds it. Look at the left pane: `null` slides into string APIs. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "With `strictNullChecks`, `null` is not string. `strictNullChecks` makes `null`/`undefined` illicit for ordinary types. It is included in `strict`: true — keep it on. Use unions explicitly when absence is allowed. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
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
