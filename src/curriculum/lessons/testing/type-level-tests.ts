import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-level-tests",
  title: "Testing types",
  tier: "advanced",
  track: "testing",
  order: 10,
  summary:
    "expectTypeOf, tsd, and hand-rolled Expect<Equal<A, B>> — asserting that a signature is what you think it is, as a first-class test.",
  prerequisites: [
    "type-level-assertions-and-equality",
    "typing-your-test-files",
  ],
  keywords: ["expectTypeOf", "tsd", "Equal", "type test", "assertType"],
  problem:
    "A refactor that changes an exported type breaks nothing in the test suite, because no test ever looked at a type.",
  js: {
    code: `// JS tests assert runtime values — signatures are undocumented.
function add(a, b) {
  return a + b;
}
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "Runtime tests cannot see TypeScript signatures.",
  },
  ts: {
    code: `type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

function add(a: number, b: number): number {
  return a + b;
}

type _ret = Expect<Equal<ReturnType<typeof add>, number>>;
type _fail = Expect<Equal<ReturnType<typeof add>, string>>;
`,
    highlights: [{ start: 14, end: 14 }],
    caption:
      "Type-level Expect<Equal<…>> fails the build when signatures drift.",
    expectedDiagnostics: [
      {
        code: 2344,
        line: 12,
        messageIncludes: "true",
      },
    ],
  },
  insight: [
    "Colocate type tests with the API they protect — they are regression tests.",
    "Libraries like expectTypeOf integrate with Vitest; Equal/Expect work without deps.",
    "Test the public exported types, not incidental inference inside implementations.",
  ],
  quiz: [
    {
      id: "typetest-q",
      prompt: "What does Expect<Equal<A, B>> do when A and B differ?",
      choices: [
        { id: "a", text: "Logs a warning at runtime" },
        { id: "b", text: "Produces a compile error" },
        { id: "c", text: "Deletes B" },
        { id: "d", text: "Nothing" },
      ],
      answerId: "b",
      explanation:
        "Equal resolves to false, which does not extend true — TS2344.",
    },
  ],
  exercise: {
    prompt:
      "Assert ReturnType of identity<T>(x: T): T is number when called as identity(1) via typeof on a const.",
    starter: `function identity<T>(x: T): T {
  return x;
}
const n = identity(1);
`,
    assertion: "no-errors",
    hints: ["type Expect + Equal on typeof n"],
    solution: `type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

function identity<T>(x: T): T {
  return x;
}
type _ok = Expect<Equal<ReturnType<typeof identity<number>>, number>>;
`,
  },
};
