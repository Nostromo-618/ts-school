import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "void-returning-callbacks",
  title: "Callbacks that return void",
  tier: "intermediate",
  track: "functions",
  order: 6,
  summary:
    "A callback typed to return `void` accepts a function that returns something. That rule is deliberate, useful, and occasionally a bug factory.",
  prerequisites: ["function-type-expressions", "void-and-never"],
  keywords: ["void", "callback", "return value", "forEach", "assignability"],
  problem:
    "arr.forEach(async item => ...) type-checks and the promises are dropped on the floor.",
  js: {
    code: `[1,2].forEach(n => { return n * 2; });
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "forEach callback return values are ignored.",
  },
  ts: {
    code: `declare function mapNumbers(
  values: number[],
  fn: (n: number) => number,
): number[];

declare function forEachNumber(
  values: number[],
  fn: (n: number) => void,
): void;

const doubled = mapNumbers([1, 2], (n) => n * 2);
forEachNumber([1, 2], (n) => n * 2);

const bad: number[] = forEachNumber([1], (n) => n);
`,
    highlights: [{ start: 13, end: 13 }],
    caption:
      "`void` callbacks may return values, but forEachNumber itself returns `void`.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 14,
        messageIncludes: "Type 'void' is not assignable to type 'number[]'",
      },
    ],
  },
  insight: [
    "`void` in callback positions is special — returned values are ignored.",
    "Do not use forEach when you need a mapped array.",
    "Match callback return types to the combinator's contract.",
  ],
};
