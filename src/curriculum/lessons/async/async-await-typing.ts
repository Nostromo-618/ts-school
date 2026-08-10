import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "async-await-typing",
  title: "async and await",
  tier: "beginner",
  track: "async",
  order: 2,
  summary:
    "async functions always return `Promise<T>`; await unwraps Promise and propagates the inner type — including unions.",
  prerequisites: ["promise-types"],
  keywords: ["async", "await", "Promise", "return type"],
  problem:
    "An async function forgets to return on one branch; callers await `undefined` and crash. Look at the left pane: implicit `undefined` return becomes a resolved `undefined`. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "`Promise<User>` rejects a bare return (`undefined`). async function f(): `Promise<T>` means every return path must produce T (or throw). await expression has the inner type of the `Promise`. Try/catch around await still types the caught value as `unknown` under useUnknownInCatchVariables. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `async function loadName(id) {
  if (id === "missing") return;
  return { name: "Ada" };
}

const user = await loadName("missing");
user.name;
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Implicit `undefined` return becomes a resolved `undefined`.",
  },
  ts: {
    code: `type User = { name: string };

async function loadName(id: string): Promise<User> {
  if (id === "missing") return;
  return { name: "Ada" };
}
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "`Promise<User>` rejects a bare return (`undefined`).",
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
