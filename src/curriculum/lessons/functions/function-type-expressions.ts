import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "function-type-expressions",
  title: "Typing a callback",
  tier: "beginner",
  track: "functions",
  order: 4,
  summary:
    "Write (x: T) => U as a type, pass it to map/filter-style helpers, and catch callbacks that return the wrong thing.",
  prerequisites: ["typing-parameters-and-returns"],
  keywords: ["callback", "function type", "=>", "higher-order"],
  problem:
    "A callback that was supposed to return a boolean returns a string; Array.prototype.filter still 'works' with surprising results. Truthy strings keep everything — not what you meant.",
  solution:
    "The callback must return boolean, not string. Function type expressions describe parameters and return without naming an implementation. Generics on the helper (keep<T>) tie the callback's value type to the array element type. Prefer named alias types for callbacks you reuse across modules.",
  js: {
    code: `function keep(items, predicate) {
  return items.filter(predicate);
}

keep([1, 2, 3], (n) => String(n));
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Truthy strings keep everything — not what you meant.",
  },
  ts: {
    code: `type Predicate<T> = (value: T) => boolean;

function keep<T>(items: T[], predicate: Predicate<T>): T[] {
  return items.filter(predicate);
}

keep([1, 2, 3], (n) => String(n));
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "The callback must return boolean, not string.",
    expectedDiagnostics: [{ code: 2322, line: 7, messageIncludes: "string" }],
  },
  insight: [
    "Function type expressions describe parameters and return without naming an implementation.",
    "Generics on the helper (keep<T>) tie the callback's value type to the array element type.",
    "Prefer named alias types for callbacks you reuse across modules.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does (value: T) => boolean describe?",
      choices: [
        { id: "a", text: "A value that is always boolean" },
        { id: "b", text: "A function from T to boolean" },
        { id: "c", text: "An array of booleans" },
        { id: "d", text: "A `Promise<boolean>`" },
      ],
      answerId: "b",
      explanation: "It is a call signature type.",
    },
  ],
  exercise: {
    prompt: "Return a boolean from the predicate.",
    starter: `type Predicate<T> = (value: T) => boolean;

function keep<T>(items: T[], predicate: Predicate<T>): T[] {
  return items.filter(predicate);
}

keep([1, 2, 3], (n) => String(n));
`,
    assertion: "no-errors",
    hints: ["(n) => n > 1"],
    solution: `type Predicate<T> = (value: T) => boolean;

function keep<T>(items: T[], predicate: Predicate<T>): T[] {
  return items.filter(predicate);
}

keep([1, 2, 3], (n) => n > 1);
`,
  },
};
