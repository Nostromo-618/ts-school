import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "excess-property-checks",
  title: "Excess property checks",
  tier: "intermediate",
  track: "structures",
  order: 11,
  summary:
    "A fresh object literal is checked more strictly than a variable holding the same object. That asymmetry is deliberate, and it explains a whole class of confusing errors.",
  prerequisites: ["type-widening-and-freshness", "interfaces-intro"],
  keywords: [
    "excess property",
    "freshness",
    "object literal",
    "typo",
    "assignability",
  ],
  problem:
    "Passing { timeout: 100 } errors on a typo'd key, and hoisting it to a variable makes the error disappear without fixing anything.",
  js: {
    code: `paint({ colour: 'red', gloss: true });
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Extra fields slide through.",
  },
  ts: {
    code: `type Paint = { colour: string };
function paint(p: Paint): void {}

paint({ colour: "red", gloss: true });

const opts = { colour: "red", gloss: true };
paint(opts);
`,
    highlights: [{ start: 4, end: 4 }],
    caption:
      "Fresh literals get excess property checks; variables can widen past them.",
    expectedDiagnostics: [
      {
        code: 2353,
        line: 4,
        messageIncludes: "Object literal may only specify known properties",
      },
    ],
  },
  insight: [
    "Excess property checks apply to fresh object literals.",
    "Assigning through a variable bypasses them — beware.",
    "Use `satisfies` or exact types when extras must be rejected.",
  ],
};
