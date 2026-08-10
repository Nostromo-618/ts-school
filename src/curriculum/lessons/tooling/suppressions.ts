import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "suppressions",
  title: "Suppressing an error honestly",
  tier: "intermediate",
  track: "tooling",
  order: 15,
  summary:
    "@ts-expect-error against @ts-ignore, why the first is nearly always right, and keeping suppressions from becoming permanent.",
  prerequisites: ["reading-type-errors", "eslint-with-typescript"],
  keywords: ["ts-expect-error", "ts-ignore", "suppression", "debt", "review"],
  problem:
    '@ts-ignore hiding a landmine. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "Suppressing an error honestly" as a CI gate, not a personal preference.',
  solution:
    "Suppressions are last resort. Final line shows a real error still caught. Prefer @ts-expect-error over @ts-ignore — it fails when the error disappears. Leave a comment explaining why. Fix the type instead when you can. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `// @ts-ignore
const n = null.length;
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "@ts-ignore hiding a landmine.",
  },
  ts: {
    code: `const maybe: string | null = null;
// Prefer @ts-expect-error with a reason — still a last resort:
// @ts-expect-error demo — null has no length
const n: number = maybe.length;

const ok: string = "x";
const bad: number = ok;
`,
    highlights: [{ start: 8, end: 8 }],
    caption:
      "Suppressions are last resort. Final line shows a real error still caught.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 7,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Prefer @ts-expect-error over @ts-ignore — it fails when the error disappears.",
    "Leave a comment explaining why.",
    "Fix the type instead when you can.",
  ],
  security: {
    title: "@ts-ignore can hide trust bugs forever",
    body: "A suppression on a boundary check (auth role, path traversal, parse result) stays quiet even after the underlying API changes. Prefer @ts-expect-error with a reason, and delete the directive as soon as the real fix lands.",
    severity: "caution",
  },
};
