import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "error-cause-and-chaining",
  title: "Error.cause",
  tier: "intermediate",
  track: "async",
  order: 7,
  summary:
    "Wrapping a low-level failure in a domain error without losing it. How cause is typed, and why `unknown` is the honest type for it.",
  prerequisites: ["custom-error-classes"],
  keywords: ["cause", "error chaining", "wrapping", "context", "unknown"],
  problem:
    "Catching and rethrowing with a friendlier message throws away the only stack trace that pointed at the real failure. `String`-concatenating nested errors. Use the cause option to chain errors without losing the stack.",
  solution:
    "Error.cause is `unknown` — not string. Use the cause option to chain errors without losing the stack. cause is `unknown` — narrow before reading. Preserve causes across async boundaries.",
  js: {
    code: `throw new Error('failed: ' + err);
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "`String`-concatenating nested errors.",
  },
  ts: {
    code: `declare const root: Error;
const wrapped = new Error("failed", { cause: root });
const c: unknown = wrapped.cause;
const bad: string = wrapped.cause;
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "Error.cause is `unknown` — not string.",
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
