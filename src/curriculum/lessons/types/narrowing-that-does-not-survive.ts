import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "narrowing-that-does-not-survive",
  title: "Where narrowing is thrown away",
  tier: "advanced",
  track: "types",
  order: 22,
  summary:
    "Callbacks, closures, mutable properties, and `any` function call can reset a narrowed type. Which ones do, and what to do instead.",
  prerequisites: ["control-flow-analysis"],
  keywords: ["narrowing", "closure", "mutation", "callback", "invalidation"],
  problem:
    "The value is definitely not `null` on line 4 and possibly `null` again on line 6, and the only thing between them is a callback. Closures capture values; JS `never` re-checks assumptions.",
  solution:
    "Capture a local const after the `null` check to keep a stable narrow across the callback. Store the narrowed value in a const local (`const u = user`) before async boundaries. Mutable properties are invalidated aggressively — narrow the field into a local. Assertion functions and type guards re-establish facts the checker will not assume across calls.",
  js: {
    code: `// JS: nothing tracks nullability across callbacks.
function load(user, cb) {
  if (user != null) {
    setTimeout(() => cb(user.name), 0);
  }
}
`,
    highlights: [{ start: 3, end: 5 }],
    caption: "Closures capture values; JS `never` re-checks assumptions.",
  },
  ts: {
    code: `type User = { name: string };

declare function later(cb: () => void): void;

function schedule(cb: (name: string) => void) {
  let user: User | null = { name: "Ada" };
  if (user !== null) {
    later(() => {
      // CFA invalidates the narrow: user can be reassigned before this runs.
      cb(user.name);
    });
  }
  user = null;
}
`,
    highlights: [{ start: 9, end: 9 }],
    caption:
      "Capture a local const after the `null` check to keep a stable narrow across the callback.",
    expectedDiagnostics: [
      {
        code: 18047,
        line: 10,
        messageIncludes: "null",
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
      prompt: "Best way to keep a non-`null` user across setTimeout?",
      choices: [
        { id: "a", text: "Use `any`" },
        { id: "b", text: "Assign to a const local after the `null` check" },
        { id: "c", text: "Disable `strictNullChecks`" },
        { id: "d", text: "Wrap in eval" },
      ],
      answerId: "b",
      explanation:
        "A const local cannot be reassigned to `null`, so the narrow remains valid in the closure.",
    },
  ],
  exercise: {
    prompt:
      "After the `null` check, assign const u = user, then use u.name inside later(...). Match the solution shape.",
    starter: `type User = { name: string };
declare function later(cb: () => void): void;
function schedule(cb: (name: string) => void) {
  let user: User | null = { name: "Ada" };
  if (user !== null) {
    later(() => {
      cb(user.name);
    });
  }
  user = null;
}
`,
    assertion: "no-errors",
    hints: ["const u = user; later(() => cb(u.name));"],
    solution: `type User = { name: string };
declare function later(cb: () => void): void;
function schedule(cb: (name: string) => void) {
  let user: User | null = { name: "Ada" };
  if (user !== null) {
    const u = user;
    later(() => {
      cb(u.name);
    });
  }
  user = null;
}
`,
  },
};
