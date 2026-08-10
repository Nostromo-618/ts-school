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
    "JavaScript will happily call a function with the wrong number of arguments, read missing properties as `undefined`, and keep going until something far away throws. The bug is not 'types exist' — it is that nothing refused the bad call when you wrote it.",
  solution:
    "Types are a local checkable contract: call sites and implementations have to agree before the code runs. Start with the mistakes you already make — wrong fields, missing null checks, bad returns — and let the checker make them loud. The TypeScript pane is the refusal; the takeaways are the habit.",
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
