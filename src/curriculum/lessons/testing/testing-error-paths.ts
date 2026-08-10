import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "testing-error-paths",
  title: "Testing the failure cases",
  tier: "intermediate",
  track: "testing",
  order: 9,
  summary:
    "Asserting on a typed error or a Result variant, and why catching in a test needs the same `unknown` handling as production code.",
  prerequisites: ["result-types", "assertions-and-narrowing-in-tests"],
  keywords: ["error", "Result", "rejects", "throws", "unknown", "catch"],
  problem:
    "expect(fn).toThrow() passes for the wrong error, and a caught value in a test is `unknown` just as it is everywhere else.",
  js: {
    code: `try { await fn(); } catch (e) { expect(e.code).toBe(404); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Reading .code on `unknown` catch values.",
  },
  ts: {
    code: `class HttpError extends Error {
  constructor(readonly code: number) {
    super("http");
  }
}
declare function fn(): Promise<never>;

export async function test404(): Promise<number> {
  try {
    await fn();
  } catch (e) {
    if (e instanceof HttpError) return e.code;
    throw e;
  }
}

const bad: string = await test404();
`,
    highlights: [{ start: 17, end: 17 }],
    caption: "Narrow in tests too. test404 returns number.",
    expectedDiagnostics: [
      {
        code: 2366,
        line: 8,
        messageIncludes: "Function lacks ending return statement and retur",
      },
      {
        code: 2322,
        line: 17,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "Error path tests should narrow `unknown` catches.",
    "Assert on discriminant fields of custom errors.",
    "Do not use `any` to reach .code.",
  ],
};
