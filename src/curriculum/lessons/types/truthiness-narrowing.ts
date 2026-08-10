import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "truthiness-narrowing",
  title: "Truthiness narrowing",
  tier: "beginner",
  track: "types",
  order: 9,
  summary:
    "if (value) removes `null`, `undefined`, 0, NaN, and the empty string from a type. That is usually more than you meant.",
  prerequisites: ["narrowing-with-typeof", "null-and-undefined"],
  keywords: ["truthiness", "falsy", "narrowing", "if"],
  problem:
    "if (count) skips the branch when count is 0, which is the one case the code was written to handle. Look at the left pane: no TypeScript error here — that's the point: truthiness treats 0 as empty. Prefer != `null` when 0 is meaningful. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "No TypeScript error here — that's the point: truthiness treats 0 as empty. Prefer != `null` when 0 is meaningful. Truthiness narrowing removes all falsy values, not just nullish ones. if (value) is fine for objects and nullable references when empty is not a value you care about. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
  js: {
    code: `function label(count) {
  if (count) return "count=" + count;
  return "empty";
}

label(0);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: '0 is falsy — a valid count becomes "empty".',
  },
  ts: {
    code: `function label(count: number | undefined): string {
  // Truthiness narrows away 0 as well as undefined.
  if (count) {
    return "count=" + count.toFixed(0);
  }
  return "empty";
}

// This call is fine to the checker — and wrong for product behavior.
export const shown = label(0);
`,
    highlights: [{ start: 3, end: 5 }],
    caption:
      "No TypeScript error here — that's the point: truthiness treats 0 as empty. Prefer != `null` when 0 is meaningful.",
    expectedDiagnostics: [],
  },
  insight: [
    "Truthiness narrowing removes all falsy values, not just nullish ones.",
    'For numbers and strings that may be 0 or "", check == `null` or === `undefined` explicitly.',
    "if (value) is fine for objects and nullable references when empty is not a value you care about.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which check keeps 0 but rejects `undefined`?",
      choices: [
        { id: "a", text: "if (count)" },
        { id: "b", text: "if (count != `null`)" },
        { id: "c", text: "if (count === true)" },
        { id: "d", text: "if (!!count)" },
      ],
      answerId: "b",
      explanation: "!= `null` rejects only `null` and `undefined`.",
    },
  ],
  exercise: {
    prompt: 'Change the guard so 0 returns "count=0".',
    starter: `function label(count: number | undefined): string {
  if (count) {
    return "count=" + count.toFixed(0);
  }
  return "empty";
}

export const shown = label(0);
`,
    assertion: "no-errors",
    hints: ["if (count != `null`)"],
    solution: `function label(count: number | undefined): string {
  if (count != null) {
    return "count=" + count.toFixed(0);
  }
  return "empty";
}

export const shown = label(0);
`,
  },
};
