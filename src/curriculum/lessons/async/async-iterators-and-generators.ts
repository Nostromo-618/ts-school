import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "async-iterators-and-generators",
  title: "Async iterators and generators",
  tier: "intermediate",
  track: "async",
  order: 11,
  summary:
    "AsyncIterable<T>, for await, and the three type parameters of a generator — the shape behind every streaming API in Node.",
  prerequisites: ["async-await-typing", "generics-intro"],
  keywords: ["async iterator", "generator", "for await", "yield", "streaming"],
  problem:
    "Generator<T, TReturn, TNext> has three parameters and almost every example on the internet uses only the first.",
  js: {
    code: `for await (const chunk of stream) { sink(chunk); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Async iteration without element types.",
  },
  ts: {
    code: `async function* ticks(n: number): AsyncGenerator<number, void, void> {
  for (let i = 0; i < n; i++) yield i;
}

export async function sum(n: number): Promise<number> {
  let total = 0;
  for await (const x of ticks(n)) total += x;
  return total;
}

const bad: string = await sum(3);
`,
    highlights: [{ start: 11, end: 11 }],
    caption: "AsyncGenerator yields number. sum returns number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 11,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "AsyncGenerator<T> types yielded values.",
    "for-await works on async iterables.",
    "Prefer streams for large IO; generators for composed async sequences.",
  ],
};
