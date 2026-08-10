import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "when-not-to-type-level-program",
  title: "When not to do any of this",
  tier: "advanced",
  track: "type-level",
  order: 21,
  summary:
    "The maintenance argument: who reads this code next, what its error messages look like when it fails, and the runtime check that would have been enough.",
  prerequisites: ["type-level-performance"],
  keywords: [
    "maintenance",
    "readability",
    "trade-off",
    "error messages",
    "judgement",
  ],
  problem:
    "The most impressive type in a codebase is often the one nobody else can change, which makes it a liability rather than an asset. Simple runtime helpers stay readable; types should not obscure them.",
  solution:
    "Wrong keys produce opaque errors; fixed interfaces stay clear. Type-level code is code — it needs readers, tests, and an exit strategy. If a runtime parse already exists, duplicating the grammar in types may be redundant. Ship the simplest type that prevents the bug class you care about; deepen only when bugs demand it.",
  js: {
    code: `// JS: a one-liner everyone understands.
function pick(obj, keys) {
  return Object.fromEntries(keys.map((k) => [k, obj[k]]));
}
`,
    highlights: [{ start: 2, end: 4 }],
    caption:
      "Simple runtime helpers stay readable; types should not obscure them.",
  },
  ts: {
    code: `// Sometimes the “clever” Pick is worse than a plain interface.
type MegaPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Prefer documenting the public shape when the set is fixed:
interface PublicUser {
  id: string;
  name: string;
}

// MegaPick explodes error messages when K is wrong:
type Oops = MegaPick<{ id: string }, "named">;
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "Wrong keys produce opaque errors; fixed interfaces stay clear.",
    expectedDiagnostics: [
      {
        code: 2344,
        line: 13,
        messageIncludes: "named",
      },
    ],
  },
  insight: [
    "Type-level code is code — it needs readers, tests, and an exit strategy.",
    "If a runtime parse already exists, duplicating the grammar in types may be redundant.",
    "Ship the simplest type that prevents the bug class you care about; deepen only when bugs demand it.",
  ],
  quiz: [
    {
      id: "when-not",
      prompt:
        "Which is the best reason to avoid a deep type-level abstraction?",
      choices: [
        { id: "a", text: "TypeScript forbids conditional types in libraries" },
        {
          id: "b",
          text: "The next maintainer cannot diagnose failures or change it safely",
        },
        { id: "c", text: "Mapped types are deprecated" },
        { id: "d", text: "Interfaces cannot describe objects" },
      ],
      answerId: "b",
      explanation:
        "Unmaintainable types become frozen debt; clarity beats cleverness when both prevent the same bugs.",
    },
  ],
  exercise: {
    prompt:
      "Prefer a plain interface Address over a complex mapped type. Define street and city as strings and construct one.",
    starter: `// TODO: interface Address { street: string; city: string }

const a = { street: "1 Main", city: "Town" };
`,
    assertion: "no-errors",
    hints: ["Write interface Address and annotate const a: Address."],
    solution: `interface Address {
  street: string;
  city: string;
}

const a: Address = { street: "1 Main", city: "Town" };
void a;
`,
  },
};
