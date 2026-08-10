import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "awaited-and-unwrapping",
  title: "Awaited and nested promises",
  tier: "intermediate",
  track: "async",
  order: 4,
  summary:
    "`Awaited`<T> flattens as far as await would. Where nested promises come from and why the naive unwrap type is wrong.",
  prerequisites: ["async-await-typing", "function-utility-types"],
  keywords: ["Awaited", "thenable", "unwrap", "nested promise", "utility type"],
  problem:
    "A cache that stores promises hands back `Promise`<`Promise`<T>> and the type that describes it has to flatten recursively.",
  js: {
    code: `async function inner() { return 1; }
async function outer() { return inner(); }
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Nested promises confuse readers.",
  },
  ts: {
    code: `async function inner(): Promise<number> {
  return 1;
}
async function outer(): Promise<number> {
  return inner();
}
type N = Awaited<ReturnType<typeof outer>>;
const n: N = 1;
const bad: N = "1";
`,
    highlights: [{ start: 9, end: 9 }],
    caption: "`Awaited` unwraps Promise layers. N is number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 9,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "async functions wrap returns in `Promise`.",
    "`Awaited`<T> unwraps nested thenables in types.",
    "Avoid returning `Promise`<`Promise`<T>> manually.",
  ],
};
