import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "narrowing-that-does-not-survive",
  title: "Where narrowing is thrown away",
  tier: "advanced",
  track: "types",
  order: 22,
  summary:
    "Callbacks, closures, mutable properties, and any function call can reset a narrowed type. Which ones do, and what to do instead.",
  prerequisites: ["control-flow-analysis"],
  keywords: ["narrowing", "closure", "mutation", "callback", "invalidation"],
  problem:
    "The value is definitely not null on line 4 and possibly null again on line 6, and the only thing between them is a callback.",
  js: {
    code: `// JS: nothing tracks nullability across callbacks.
function load(user, cb) {
  if (user != null) {
    setTimeout(() => cb(user.name), 0);
  }
}
`,
    highlights: [{ start: 3, end: 5 }],
    caption: "Closures capture values; JS never re-checks assumptions.",
  },
  ts: {
    code: `type User = { name: string };

declare function later(cb: () => void): void;

function load(user: User | null, cb: (name: string) => void) {
  if (user !== null) {
    later(() => {
      // Prefer a const local for async boundaries; shown here for the quiz.
      cb(user.name);
    });
  }
}

let u: User | null = { name: "Ada" };
load(u, (name) => {
  const n: number = name;
  void n;
});
`,
    highlights: [{ start: 16, end: 16 }],
    caption:
      "Capture a local const after the null check to keep a stable narrow.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 16,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Store the narrowed value in a const local (`const u = user`) before async boundaries.",
    "Mutable properties are invalidated aggressively — narrow the field into a local.",
    "Assertion functions and type guards re-establish facts the checker will not assume across calls.",
  ],
  quiz: [
    {
      id: "narrow-survive",
      prompt: "Best way to keep a non-null user across setTimeout?",
      choices: [
        { id: "a", text: "Use any" },
        { id: "b", text: "Assign to a const local after the null check" },
        { id: "c", text: "Disable strictNullChecks" },
        { id: "d", text: "Wrap in eval" },
      ],
      answerId: "b",
      explanation:
        "A const local cannot be reassigned to null, so the narrow remains valid in the closure.",
    },
  ],
  exercise: {
    prompt:
      "Fix pattern: after if (user !== null), const u = user; then use u.name in a nested function.",
    starter: `type User = { name: string };
function run(user: User | null, cb: (n: string) => void) {
  if (user !== null) {
    cb(user.name);
  }
}
`,
    assertion: "no-errors",
    hints: ["const u = user; cb(u.name)"],
    solution: `type User = { name: string };
function run(user: User | null, cb: (n: string) => void) {
  if (user !== null) {
    const u = user;
    cb(u.name);
  }
}
`,
  },
};
