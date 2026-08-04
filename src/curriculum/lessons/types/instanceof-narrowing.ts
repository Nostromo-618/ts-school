import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "instanceof-narrowing",
  title: "Narrowing with instanceof",
  tier: "intermediate",
  track: "types",
  order: 15,
  summary:
    "instanceof narrows to a class, and does it by prototype chain â which is why it fails across realms and after transpiled subclassing.",
  prerequisites: ["narrowing-with-typeof"],
  keywords: ["instanceof", "prototype", "class", "narrowing", "realm"],
  problem:
    "instanceof Error is the standard way to inspect a caught value, and it silently stops working across a worker or vm boundary.",
  js: {
    code: `function message(err) {
  if (err instanceof Error) return err.message;
  return String(err);
}
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Assuming err has .message.",
  },
  ts: {
    code: `function message(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

class HttpError extends Error {
  constructor(readonly status: number, msg: string) {
    super(msg);
  }
}

function statusOf(err: unknown): number {
  if (err instanceof HttpError) return err.status;
  return 500;
}

const n: number = message(new Error("x"));
`,
    highlights: [{ start: 18, end: 18 }],
    caption: "message returns string — assigning to number fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "instanceof narrows class instances across catch/unknown boundaries.",
    "Custom error classes carry fields the base Error does not.",
    "Cross-realm instanceof can fail — prefer brand checks for libraries.",
  ],
};
