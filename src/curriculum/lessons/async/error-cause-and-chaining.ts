import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "error-cause-and-chaining",
  title: "Error.cause",
  tier: "intermediate",
  track: "async",
  order: 7,
  summary:
    "Wrap a low-level failure in a domain error with `cause` so the original stack survives — and type `cause` as `unknown`.",
  prerequisites: ["custom-error-classes"],
  keywords: ["cause", "error chaining", "wrapping", "context", "unknown"],
  problem:
    'A catch block rethrows `new Error("upload failed: " + e)` and concatenates the message. The only stack that pointed at the disk or network failure is gone; on-call sees a friendly string and nothing else. String-concatenating nested errors destroys the chain you need for diagnosis.',
  solution:
    'Use `new Error("upload failed", { cause: e })` so the runtime keeps the underlying failure. TypeScript types `error.cause` as `unknown` — narrow before reading fields, just like a catch binding. Preserve causes across async boundaries when you wrap; do not flatten them into one message. The TypeScript pane refuses treating `cause` as a string because it is not one.',
  js: {
    code: `throw new Error('failed: ' + err);
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "String-concatenating nested errors throws away the useful stack.",
  },
  ts: {
    code: `declare const root: Error;
const wrapped = new Error("failed", { cause: root });
const c: unknown = wrapped.cause;
const bad: string = wrapped.cause;
`,
    highlights: [{ start: 4, end: 4 }],
    caption:
      "`Error.cause` is `unknown` — chain it, then narrow before reading.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 4,
        messageIncludes: "Type 'unknown' is not assignable to type 'string",
      },
    ],
  },
  insight: [
    "Use the cause option to chain errors without losing the stack.",
    "cause is `unknown` — narrow before reading.",
    "Preserve causes across async boundaries.",
  ],
};
