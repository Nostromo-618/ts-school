import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "narrowing-with-typeof",
  title: "Narrowing with typeof",
  tier: "beginner",
  track: "types",
  order: 8,
  summary:
    "A `typeof` check does not just branch at runtime; it changes the type inside the branch. Plus the one lie `typeof` still tells about `null`.",
  prerequisites: ["union-types"],
  keywords: ["typeof", "narrowing", "type guard", "null"],
  problem:
    "You checked the type on line 3, but on line 7 the value is still a union as far as anything reading the code can tell. Look at the left pane: number(true) is 1 — `typeof` would have rejected the boolean path. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "Multiply is not valid on string | number until you narrow. string. object. After an early return in the number branch, the rest of the function sees the remaining union members. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `function asNumber(value) {
  if (typeof value === "number") return value;
  return Number(value);
}

asNumber(true).toFixed(2);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Number(true) is 1 — `typeof` would have rejected the boolean path.",
  },
  ts: {
    code: `function double(value: string | number): number {
  // Outside the typeof branch, value is still the full union.
  return value * 2;
}
`,
    highlights: [{ start: 3, end: 3 }],
    caption: "Multiply is not valid on string | number until you narrow.",
    expectedDiagnostics: [
      { code: 2362, line: 3, messageIncludes: "arithmetic" },
    ],
  },
  insight: [
    '`typeof` value === "string" narrows value to string inside that block.',
    '`typeof` `null` === "object" — use === `null` for `null`, not `typeof`.',
    "After an early return in the number branch, the rest of the function sees the remaining union members.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does `typeof` `null` return in JavaScript?",
      choices: [
        { id: "a", text: '"`null`"' },
        { id: "b", text: '"object"' },
        { id: "c", text: '"`undefined`"' },
        { id: "d", text: '"number"' },
      ],
      answerId: "b",
      explanation:
        "The long-standing `typeof` `null` quirk — compare to `null` directly.",
    },
  ],
  exercise: {
    prompt: "Narrow with `typeof` before multiplying.",
    starter: `function double(value: string | number): number {
  return value * 2;
}
`,
    assertion: "no-errors",
    hints: [
      'if (`typeof` value === "number") return value * 2; return Number(value) * 2;',
    ],
    solution: `function double(value: string | number): number {
  if (typeof value === "number") return value * 2;
  return Number(value) * 2;
}
`,
  },
};
