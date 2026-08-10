import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "custom-error-classes",
  title: "Custom error classes",
  tier: "intermediate",
  track: "async",
  order: 6,
  summary:
    "Extending Error, keeping `instanceof` working across transpilation targets, and adding typed fields without breaking the stack trace.",
  prerequisites: ["catch-gives-you-unknown", "classes-intro"],
  keywords: ["Error", "extends", "instanceof", "setPrototypeOf", "stack"],
  problem:
    "Subclassing Error and compiling down to ES5 quietly breaks `instanceof`, so the catch block that handles your error never runs. Look at the left pane: throwing plain objects. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Custom Error subclasses carry typed fields. handle returns number. Extend Error and set name for debuggability. `instanceof` works within the same realm. Include cause when wrapping lower-level failures. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `throw { code: 404, message: 'missing' };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Throwing plain objects.",
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
    caption:
      "Custom Error subclasses carry typed fields. handle returns number.",
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
