import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "async-await-typing",
  title: "async and await",
  tier: "beginner",
  track: "async",
  order: 2,
  summary:
    "`async` functions always return `Promise<T>`; `await` unwraps that promise — including unions — into the caller's type.",
  prerequisites: ["promise-types"],
  keywords: ["async", "await", "Promise", "return type"],
  problem:
    "An `async` function returns a user on the happy path and accidentally falls off the end on an error branch. Callers `await` what they believe is a `User` and then read `.id` — but the missing return resolved to `undefined`. JavaScript will run that. The failure mode is a silent `Promise<undefined>` where every call site assumed a complete object.",
  solution:
    "Declare `async function f(): Promise<User>` so every return path must produce a `User` (or throw). The TypeScript pane rejects a bare `return` because it would resolve to `undefined`. `await` then gives you the inner type — including unions — so you still narrow when the promise can resolve to more than one shape. Keep try/catch honest too: under `useUnknownInCatchVariables`, the caught value is still `unknown` even inside an `async` function.",
  js: {
    code: `async function loadName(id) {
  if (id === "missing") return;
  return { name: "Ada" };
}

const user = await loadName("missing");
user.name;
`,
    highlights: [{ start: 7, end: 7 }],
    caption:
      "A forgotten return becomes a resolved `undefined` that callers treat as a user.",
  },
  ts: {
    code: `type User = { name: string };

async function loadName(id: string): Promise<User> {
  if (id === "missing") return;
  return { name: "Ada" };
}
`,
    highlights: [{ start: 4, end: 4 }],
    caption:
      "`Promise<User>` rejects a bare return that would resolve to `undefined`.",
    expectedDiagnostics: [
      { code: 2322, line: 4, messageIncludes: "undefined" },
    ],
  },
  insight: [
    "async function f(): `Promise<T>` means every return path must produce T (or throw).",
    "await expression has the inner type of the `Promise`.",
    "Try/catch around await still types the caught value as `unknown` under useUnknownInCatchVariables.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does an async function always return?",
      choices: [
        { id: "a", text: "`void`" },
        { id: "b", text: "A Promise" },
        { id: "c", text: "A Generator" },
        { id: "d", text: "`null`" },
      ],
      answerId: "b",
      explanation: "Even `return 1` becomes `Promise.resolve`(1).",
    },
  ],
  exercise: {
    prompt: "Allow a `null` result in the return type.",
    starter: `type User = { name: string };

async function loadName(id: string): Promise<User> {
  if (id === "missing") return;
  return { name: "Ada" };
}
`,
    assertion: "no-errors",
    hints: ["`Promise<User | null>` and return `null`"],
    solution: `type User = { name: string };

async function loadName(id: string): Promise<User | null> {
  if (id === "missing") return null;
  return { name: "Ada" };
}
`,
  },
};
