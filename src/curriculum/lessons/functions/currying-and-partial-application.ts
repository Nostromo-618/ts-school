import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "currying-and-partial-application",
  title: "Keeping inference through composition",
  tier: "intermediate",
  track: "functions",
  order: 15,
  summary:
    "Curried functions, pipelines, and middleware chains all lose type information at the joins unless the signatures are written to carry it through.",
  prerequisites: ["generic-utility-functions", "inferring-type-arguments"],
  keywords: ["curry", "compose", "pipeline", "middleware", "inference"],
  problem:
    "Curried add with no numeric guarantee. Shared helpers amplify the hole: wrong arguments, erased returns, or forgotten type relationships spread to every caller. Callers copy the signature they see — if it lies, the lie spreads.",
  solution:
    "Inner function returns number, not string. Generics can thread types through partial application. Prefer simple functions until currying clarifies an API. Inference across multiple arrows can need annotations. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `function add(a) { return (b) => a + b; }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Curried add with no numeric guarantee.",
  },
  ts: {
    code: `function add<A extends number>(a: A): (b: number) => number {
  return (b) => a + b;
}
const plus1 = add(1);
const n: number = plus1(2);
const bad: string = plus1(2);
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Inner function returns number, not string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "Generics can thread types through partial application.",
    "Prefer simple functions until currying clarifies an API.",
    "Inference across multiple arrows can need annotations.",
  ],
};
