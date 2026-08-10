import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "promise-combinators",
  title: "all, allSettled, race, any",
  tier: "intermediate",
  track: "async",
  order: 10,
  summary:
    "`Promise.all` preserves a tuple's element types, allSettled gives you a discriminated union per element, and race and `any` differ in how they fail.",
  prerequisites: ["promise-types", "arrays-and-tuples"],
  keywords: ["Promise.all", "allSettled", "race", "tuple", "AggregateError"],
  problem:
    "`Promise.all` over a heterogeneous array collapses to a union unless the argument is a tuple, and array literals are not tuples by default. Assuming `Promise.all` shape.",
  solution:
    "`Promise.all` returns User[], not number. all fails fast; allSettled preserves per-task status. race/`any` pick first settlement — type the winner carefully. Type the array you pass in — inference follows.",
  js: {
    code: `Promise.all(tasks).then(xs => xs[0].id);
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Assuming `Promise.all` shape.",
  },
  ts: {
    code: `type User = { id: string };
declare const tasks: Promise<User>[];

export async function firstId(): Promise<string> {
  const xs = await Promise.all(tasks);
  return xs[0]!.id;
}

const n: number = await Promise.all(tasks);
`,
    highlights: [{ start: 9, end: 9 }],
    caption: "`Promise.all` returns User[], not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 9,
        messageIncludes: "Type 'User[]' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "all fails fast; allSettled preserves per-task status.",
    "race/`any` pick first settlement — type the winner carefully.",
    "Type the array you pass in — inference follows.",
  ],
};
