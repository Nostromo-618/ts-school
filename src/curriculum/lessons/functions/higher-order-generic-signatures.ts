import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "higher-order-generic-signatures",
  title: "Generic functions as values",
  tier: "advanced",
  track: "functions",
  order: 21,
  summary:
    "Passing a generic function without instantiating it, instantiation expressions, and where higher-kinded types would help if TypeScript had them.",
  prerequisites: [
    "currying-and-partial-application",
    "generic-inference-internals",
  ],
  keywords: [
    "higher order",
    "instantiation expression",
    "generic value",
    "hkt",
  ],
  problem:
    "Storing a generic function in a variable collapses it to one instantiation, and the abstraction you were building disappears. Higher-order helpers in JS carry no type parameters as values.",
  solution:
    "Once collapsed to a concrete signature, other T values are rejected. Generic function values stay generic when passed to higher-order functions that expect `<T>(…) => …`. Instantiation expressions (`fn<Type>`) fix type arguments without invoking the function. TypeScript lacks higher-kinded types; encode patterns with generics on functions, not type constructors as values.",
  js: {
    code: `// JS: map is generic in spirit but values are untyped.
const map = (arr, fn) => arr.map(fn);
const mapped = map([1, 2], (n) => String(n));
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Higher-order helpers in JS carry no type parameters as values.",
  },
  ts: {
    code: `function identity<T>(x: T): T {
  return x;
}

// Instantiation expression: fix T without calling.
const idString = identity<string>;
const s = idString("ok");

// Assigning the generic to a non-generic variable collapses it:
const collapsed: (x: string) => string = identity;
const n = collapsed(1);
`,
    highlights: [{ start: 11, end: 11 }],
    caption:
      "Once collapsed to a concrete signature, other T values are rejected.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 11,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "Generic function values stay generic when passed to higher-order functions that expect `<T>(…) => …`.",
    "Instantiation expressions (`fn<Type>`) fix type arguments without invoking the function.",
    "TypeScript lacks higher-kinded types; encode patterns with generics on functions, not type constructors as values.",
  ],
  quiz: [
    {
      id: "hkt-q",
      prompt:
        "What does `identity<string>` (without call parentheses) produce?",
      choices: [
        { id: "a", text: "A compile error" },
        { id: "b", text: "An instantiation expression: (x: string) => string" },
        { id: "c", text: 'The string "identity"' },
        { id: "d", text: "A `Promise<string>`" },
      ],
      answerId: "b",
      explanation:
        "It is an instantiation expression: a value with type arguments applied.",
    },
  ],
  exercise: {
    prompt: "Create const asNumber = identity<number> and call it with 42.",
    starter: `function identity<T>(x: T): T {
  return x;
}

const asNumber = identity;
const n = asNumber(42);
`,
    assertion: "no-errors",
    hints: ["Use identity<number> without calling."],
    solution: `function identity<T>(x: T): T {
  return x;
}

const asNumber = identity<number>;
const n = asNumber(42);
void n;
`,
  },
};
