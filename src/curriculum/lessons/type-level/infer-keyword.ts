import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "infer-keyword",
  title: "infer",
  tier: "advanced",
  track: "type-level",
  order: 10,
  summary:
    "Capturing a type out of a match inside a conditional type. The mechanism behind `ReturnType`, `Awaited`, and every parser you will write here.",
  prerequisites: ["conditional-types-intro"],
  keywords: [
    "infer",
    "conditional type",
    "pattern match",
    "extract",
    "ReturnType",
  ],
  problem:
    "Reading a type argument back out of a generic type has no syntax at all until you reach for `infer`.",
  js: {
    code: `// JS: "return type of fn" is a comment, not a check.
function getUser() {
  return { id: 1, name: "Ada" };
}

// Somewhere else: hope the shape still matches.
function printName(user) {
  console.log(user.name.toUpperCase());
}

printName(getUser());
`,
    highlights: [{ start: 7, end: 9 }],
    caption: "JavaScript has no way to name “whatever getUser returns”.",
  },
  ts: {
    code: `type MyReturnType<F> = F extends (...args: never[]) => infer R
  ? R
  : never;

function getUser() {
  return { id: 1, name: "Ada" };
}

type User = MyReturnType<typeof getUser>;
// User is { id: number; name: string }

const wrong: User = { id: 1 };
// missing name — the inferred shape is enforceable
`,
    highlights: [
      { start: 1, end: 3 },
      { start: 11, end: 12 },
    ],
    caption:
      "`infer` R binds the return type inside the match; wrong assignments fail.",
    expectedDiagnostics: [
      {
        code: 2741,
        line: 12,
        messageIncludes: "name",
      },
    ],
  },
  insight: [
    "`infer` only works inside the extends clause of a conditional type — it is pattern-matching, not a free-standing operator.",
    "Multiple `infer` positions can bind several type variables in one match (e.g. parameters and return together).",
    "`ReturnType`, `Parameters`, and `Awaited` in lib.es5 / es2022 are built from `infer`; writing your own is the same mechanism.",
  ],
  quiz: [
    {
      id: "infer-where",
      prompt: "Where is `infer` legal?",
      choices: [
        { id: "a", text: "Anywhere a type annotation appears" },
        { id: "b", text: "Only in the true/false arms of a conditional type" },
        {
          id: "c",
          text: "Only in the extends clause of a conditional type",
        },
        { id: "d", text: "Only inside mapped types" },
      ],
      answerId: "c",
      explanation:
        "`infer` introduces a type variable by matching a shape in the extends check. Outside that clause it is a syntax error.",
    },
  ],
  exercise: {
    prompt:
      "Implement Head<T> that extracts the first element type of a tuple (or array). For [string, number] it should be string. Non-array inputs should be `never`.",
    starter: `type Head<T> = T; // TODO: use infer

type A = Head<[string, number]>;
const check: A = 0; // should be an error — A must be string
`,
    assertion: "no-errors",
    hints: [
      "Match T against `readonly` [`infer` H, ...`unknown`[]] or (`infer` H)[].",
      "Use a conditional: T extends … ? H : `never`.",
    ],
    solution: `type Head<T> = T extends readonly [infer H, ...unknown[]]
  ? H
  : T extends readonly (infer H)[]
    ? H
    : never;

type A = Head<[string, number]>;
const ok: A = "hi";
void ok;
`,
  },
  references: [
    {
      title: "Handbook: Conditional Types — Inferring Within Conditional Types",
      href: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types",
    },
  ],
};
