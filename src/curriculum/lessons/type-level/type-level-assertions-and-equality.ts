import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-level-assertions-and-equality",
  title: "Comparing two types",
  tier: "advanced",
  track: "type-level",
  order: 19,
  summary:
    "Why Equal<A, B> is surprisingly hard, what the conditional-identity trick actually tests, and how to build assertions you can trust.",
  prerequisites: ["conditional-types-intro", "assignability-rules"],
  keywords: ["Equal", "type assertion", "identity", "Expect", "type test"],
  problem:
    "Runtime deep-equal cannot assert compile-time type identity. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases.",
  solution:
    "The identity trick rejects `any`/`never` false friends. A extends B and B extends A is assignability, not equality — `any` and `never` break it. The `<T>() => T extends X ? 1 : 2` trick compares how X behaves under inference. Use Expect<Equal<A, B>> in type-level tests; treat failures as red builds. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `// JS: "same shape?" is JSON.stringify or a hand-rolled deepEqual.
function sameShape(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
// Types do not exist at runtime — equality of types is a compile-time problem.
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "Runtime deep-equal cannot assert compile-time type identity.",
  },
  ts: {
    code: `type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

type Expect<T extends true> = T;

type _ok = Expect<Equal<{ a: 1 }, { a: 1 }>>;

// Equal rejects any === number; Expect fails when the answer is false.
type _fail = Expect<Equal<any, number>>;
`,
    highlights: [
      { start: 1, end: 4 },
      { start: 10, end: 10 },
    ],
    caption: "The identity trick rejects `any`/`never` false friends.",
    expectedDiagnostics: [
      {
        code: 2344,
        line: 11,
        messageIncludes: "true",
      },
    ],
  },
  insight: [
    "A extends B and B extends A is assignability, not equality — `any` and `never` break it.",
    "The `<T>() => T extends X ? 1 : 2` trick compares how X behaves under inference.",
    "Use Expect<Equal<A, B>> in type-level tests; treat failures as red builds.",
  ],
  quiz: [
    {
      id: "eq-any",
      prompt:
        "Why is `any extends number ? (number extends any ? true : false) : false` true?",
      choices: [
        { id: "a", text: "`any` is identical to number" },
        {
          id: "b",
          text: "`any` is both a top-ish and bottom-ish participant in extends",
        },
        { id: "c", text: "number is `any` under `strict` mode" },
        { id: "d", text: "The conditional is invalid" },
      ],
      answerId: "b",
      explanation:
        "`any` is assignable to and from almost everything, so mutual extends succeeds without meaning equality.",
    },
  ],
  exercise: {
    prompt:
      "Using Equal and Expect from the lesson pattern, assert that string | number equals number | string (order should not matter for this Equal).",
    starter: `type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type _test = Expect<Equal<string, number>>; // fix to a true equality
`,
    assertion: "no-errors",
    hints: ["Equal<string | number, number | string>"],
    solution: `type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type _test = Expect<Equal<string | number, number | string>>;
`,
  },
};
