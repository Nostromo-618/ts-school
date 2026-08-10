import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "awaited-and-unwrapping",
  title: "Awaited and nested promises",
  tier: "intermediate",
  track: "async",
  order: 4,
  summary:
    "`Awaited<T>` flattens nested thenables the way `await` does — so types describing caches and wrappers stay honest.",
  prerequisites: ["async-await-typing", "function-utility-types"],
  keywords: ["Awaited", "thenable", "unwrap", "nested promise", "utility type"],
  problem:
    "A cache that stores in-flight work ends up typed as `Promise<Promise<User>>`. Callers who unwrap once still hold a promise, and the next `.email` access is either a lie or a second await nobody remembered. Nested promises confuse readers and break generic helpers that assume one layer. The failure mode is a type that looks settled while the runtime value is still pending.",
  solution:
    "`Awaited<T>` recursively unwraps promise-like types the same way `await` does at runtime. Use it when you describe the result of awaiting a value you did not author — caches, wrappers, library returns. Prefer not to return `Promise<Promise<T>>` from your own APIs: let `async` wrap once, and let `Awaited` clean up the types at boundaries. The TypeScript pane shows a number after unwrapping, not another promise layer.",
  js: {
    code: `async function inner() { return 1; }
async function outer() { return inner(); }
`,
    highlights: [{ start: 1, end: 2 }],
    caption:
      "Nested promises look settled after one unwrap — until they are not.",
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
    caption:
      "`Awaited` collapses promise layers so the remaining type matches `await`.",
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
    "`Awaited<T>` unwraps nested thenables in types.",
    "Avoid returning `Promise<Promise<T>>` manually.",
  ],
};
