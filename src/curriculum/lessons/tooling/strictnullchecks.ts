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
    "Cannot read properties of undefined is the most common runtime error in Node, and this is the flag that finds it.",
  js: {
    code: `function len(s) { return s.length; }
len(null);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "null slides into string APIs.",
  },
  ts: {
    code: `function len(s: string): number {
  return s.length;
}
len(null);
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "With strictNullChecks, null is not string.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 4,
        messageIncludes: "Argument of type 'null' is not assignable to par",
      },
    ],
  },
  insight: [
    "strictNullChecks makes null/undefined illicit for ordinary types.",
    "It is included in strict: true — keep it on.",
    "Use unions explicitly when absence is allowed.",
  ],
};
