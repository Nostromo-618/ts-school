import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "promise-combinators",
  title: "all, allSettled, race, any",
  tier: "intermediate",
  track: "async",
  order: 10,
  summary:
    "`Promise.all` preserves tuple element types; `allSettled` gives a per-item discriminant; `race` and `any` differ in how they fail.",
  prerequisites: ["promise-types", "arrays-and-tuples"],
  keywords: ["Promise.all", "allSettled", "race", "tuple", "AggregateError"],
  problem:
    "You pass a heterogeneous list to `Promise.all` and assume the result is a tidy tuple of concrete types. Inference collapses to a union (or worse), and a later index access is either unsafe or rejected. Separately, treating `all` like `allSettled` means one rejection discards every sibling result you still needed for partial UI. Wrong combinator, wrong failure mode.",
  solution:
    "Type the array you pass in — tuple inference follows the input shape — and pick the combinator for the failure policy you want. `all` fails fast; `allSettled` preserves per-task status as a discriminant; `race`/`any` settle on a winner and need careful winner typing. The TypeScript pane shows that `Promise.all` of users is `User[]`, not a number. Match the combinator to the product behavior, then let the types describe that behavior.",
  js: {
    code: `Promise.all(tasks).then(xs => xs[0].id);
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Assuming `Promise.all` always yields the shape you imagined.",
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
    caption:
      "`Promise.all` returns `User[]` here — not a number — and fails fast.",
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
