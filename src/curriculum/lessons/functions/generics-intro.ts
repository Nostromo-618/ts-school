import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "generics-intro",
  title: "Generics: keeping the caller's type",
  tier: "intermediate",
  track: "functions",
  order: 7,
  summary:
    "A type parameter is a hole the caller fills. The difference between a function that takes `any` and one that takes T is the difference between forgetting and remembering.",
  prerequisites: ["typing-parameters-and-returns", "union-types"],
  keywords: ["generic", "type parameter", "identity", "reuse", "inference"],
  problem:
    'A helper typed with `any` hands `any` back, so one utility erases types across every call site that uses it. `identity(1)` and `identity("a")` look fine until a later assignment assumes the wrong concrete type — and nothing in the signature preserved the relationship.',
  solution:
    'Introduce a type parameter `T` so input and output stay linked: `identity<T>(x: T): T`. Inference usually fills `T` from the argument; you annotate when the relationship must be stated. The TypeScript pane shows that `identity("a")` is not a `number`. Start with one type parameter before adding constraints — preserve information first, constrain second.',
  js: {
    code: `function identity(x) { return x; }
const n = identity(1);
const s = identity('a');
`,
    highlights: [{ start: 1, end: 3 }],
    caption: "One function, many shapes — no relationship preserved.",
  },
  ts: {
    code: `function identity<T>(x: T): T {
  return x;
}
const n: number = identity(1);
const s: string = identity("a");
const bad: number = identity("a");
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Generic T ties input to output. string is not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Generics preserve relationships between inputs and outputs.",
    "Let inference work — annotate when the relationship matters.",
    "Start with one type parameter before adding constraints.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "What does identity<T>(x: T): T preserve that identity(x: `any`): `any` loses?",
      choices: [
        { id: "a", text: "The caller's concrete type through the call" },
        { id: "b", text: "Runtime `typeof` checks" },
        { id: "c", text: "Promise wrapping" },
        { id: "d", text: "Private field access" },
      ],
      answerId: "a",
      explanation:
        "T links the argument type to the return type; `any` forgets both.",
    },
  ],
};
