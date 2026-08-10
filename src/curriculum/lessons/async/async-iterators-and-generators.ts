import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "async-iterators-and-generators",
  title: "Async iterators and generators",
  tier: "intermediate",
  track: "async",
  order: 11,
  summary:
    "`AsyncIterable<T>`, `for await`, and `AsyncGenerator`'s type parameters — the shape behind streaming APIs in Node.",
  prerequisites: ["async-await-typing", "generics-intro"],
  keywords: ["async iterator", "generator", "for await", "yield", "streaming"],
  problem:
    "A streaming helper yields values with no element type, so consumers treat every chunk as `any` and only discover shape bugs deep in a pipeline. Separately, authors copy `Generator<T>` examples that ignore `TReturn`/`TNext` and then wonder why `next(value)` typing feels wrong. Untyped async iteration hides backpressure and shape mistakes until production volume arrives.",
  solution:
    "Type yielded values with `AsyncGenerator<T>` (or `AsyncIterable<T>`) so `for await` narrows each element. Learn the three generator parameters when you push values back in; most readers only need the first. Prefer streams for large IO and generators for composed async sequences you control. The TypeScript pane keeps yields as `number` and `sum` as `number` — the relationship is the teaching point.",
  js: {
    code: `for await (const chunk of stream) { sink(chunk); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption:
      "Async iteration without element types leaks `any` through the pipeline.",
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
    caption:
      "`AsyncGenerator` yields `number`; consumers see that type in `for await`.",
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
