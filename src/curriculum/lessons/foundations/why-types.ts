import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "why-types",
  title: "Why types at all",
  tier: "beginner",
  track: "foundations",
  order: 1,
  summary:
    "The class of bug a Node service ships every week — a renamed field, a string where a number was meant — and why a type checker is cheaper than the test that would have caught it.",
  prerequisites: [],
  keywords: [
    "why typescript",
    "motivation",
    "static types",
    "bugs",
    "refactoring",
  ],
  problem:
    "JavaScript happily reads a property that does not exist and gives you `undefined`, so the failure surfaces three functions away from the mistake. Look at the left pane: a renamed field becomes NaN with no complaint at the call site. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "TypeScript refuses the payload that still uses the old field name. The bug is not 'division by `undefined`' — it is a shape mismatch at the boundary between two modules. A type checker moves that failure from production (or a distant unit test) to the edit you just made. You adopt TypeScript for the class of bug you already ship, not for academic purity. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
  js: {
    code: `// Downstream renamed total → totalCents; callers still send total.
function charge(order) {
  // undefined / 100 → NaN, then a bogus charge amount in production.
  return order.totalCents / 100;
}

const payload = { id: "ord_1", total: 4999 };
charge(payload);
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "A renamed field becomes NaN with no complaint at the call site.",
  },
  ts: {
    code: `type Order = { id: string; totalCents: number };

function charge(order: Order) {
  return order.totalCents / 100;
}

const payload = { id: "ord_1", total: 4999 };
charge(payload);
`,
    highlights: [{ start: 7, end: 7 }],
    caption:
      "TypeScript refuses the payload that still uses the old field name.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 8,
        messageIncludes: "totalCents",
      },
    ],
  },
  insight: [
    "The bug is not 'division by `undefined`' — it is a shape mismatch at the boundary between two modules.",
    "A type checker moves that failure from production (or a distant unit test) to the edit you just made.",
    "You adopt TypeScript for the class of bug you already ship, not for academic purity.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "In the JavaScript version, what does charge return when totalCents is missing?",
      choices: [
        { id: "a", text: "It throws immediately" },
        { id: "b", text: "NaN (`undefined` / 100)" },
        { id: "c", text: "0" },
        { id: "d", text: "`null`" },
      ],
      answerId: "b",
      explanation:
        "Reading a missing property yields `undefined`; dividing it produces NaN, which often slips into money math without throwing.",
    },
  ],
  exercise: {
    prompt:
      "Fix the call site so charge accepts a valid Order (use totalCents: 4999).",
    starter: `type Order = { id: string; totalCents: number };

function charge(order: Order) {
  return order.totalCents / 100;
}

const payload = { id: "ord_1", total: 4999 };
charge(payload);
`,
    assertion: "no-errors",
    hints: ["Rename total to totalCents on the object literal."],
    solution: `type Order = { id: string; totalCents: number };

function charge(order: Order) {
  return order.totalCents / 100;
}

const payload = { id: "ord_1", totalCents: 4999 };
charge(payload);
`,
  },
  references: [
    {
      title: "TypeScript Handbook — Everyday Types",
      href: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      note: "The shapes you will use on day one.",
    },
  ],
};
