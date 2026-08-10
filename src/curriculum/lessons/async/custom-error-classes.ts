import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "custom-error-classes",
  title: "Custom error classes",
  tier: "intermediate",
  track: "async",
  order: 6,
  summary:
    "Extend `Error` with typed fields, keep `instanceof` reliable, and preserve stacks when you wrap lower-level failures.",
  prerequisites: ["catch-gives-you-unknown", "classes-intro"],
  keywords: ["Error", "extends", "instanceof", "setPrototypeOf", "stack"],
  problem:
    'A service throws a plain object `{ code, message }` or a subclass that lost its prototype after an old emit target. Catch blocks that branch on `instanceof` never match, so the "handled" path falls through to a generic 500. Throwing unstructured values makes recovery guesswork: you cannot rely on fields or on identity checks across module boundaries.',
  solution:
    'Subclass `Error`, set `name`, and add the typed fields your handlers need. Prefer `cause` when wrapping a lower-level failure so the original stack stays reachable. `instanceof` works within the same realm for proper subclasses — that is the recovery channel the TypeScript pane models with typed fields. Avoid ES5 downlevel quirks for Error subclasses in modern Node targets, and never replace structured errors with stringly `throw "oops"` at module boundaries.',
  js: {
    code: `throw { code: 404, message: 'missing' };
`,
    highlights: [{ start: 1, end: 1 }],
    caption:
      "Plain thrown objects skip `instanceof` handlers and lose stack discipline.",
  },
  ts: {
    code: `class AppError extends Error {
  constructor(
    readonly code: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

function handle(err: unknown): number {
  if (err instanceof AppError) return err.code;
  return 500;
}

const n: number = handle(new AppError(404, "missing"));
const bad: string = handle(new AppError(404, "missing"));
`,
    highlights: [{ start: 17, end: 17 }],
    caption: "Custom `Error` subclasses carry typed fields handlers can trust.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "Extend Error and set name for debuggability.",
    "`instanceof` works within the same realm.",
    "Include cause when wrapping lower-level failures.",
  ],
};
