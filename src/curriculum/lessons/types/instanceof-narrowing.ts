import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "instanceof-narrowing",
  title: "Narrowing with instanceof",
  tier: "intermediate",
  track: "types",
  order: 15,
  summary:
    "`instanceof` narrows to a class, and does it by prototype chain — which is why it fails across realms and after transpiled subclassing.",
  prerequisites: ["narrowing-with-typeof"],
  keywords: ["instanceof", "prototype", "class", "narrowing", "realm"],
  problem:
    "`instanceof` Error is the standard way to inspect a caught value, and it silently stops working across a worker or vm boundary. Look at the left pane: assuming err has .message. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "message returns string — assigning to number fails. `instanceof` narrows class instances across catch/`unknown` boundaries. Custom error classes carry fields the base Error does not. Cross-realm `instanceof` can fail — prefer brand checks for libraries. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
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
    "`instanceof` narrows class instances across catch/`unknown` boundaries.",
    "Custom error classes carry fields the base Error does not.",
    "Cross-realm `instanceof` can fail — prefer brand checks for libraries.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "What is `instanceof` especially useful for in TypeScript catch blocks?",
      choices: [
        { id: "a", text: "Making catch return `never`" },
        {
          id: "b",
          text: "Narrowing `unknown`/Error-like values to a concrete class with fields",
        },
        { id: "c", text: "Erasing the error at emit" },
        { id: "d", text: "Converting errors into strings automatically" },
      ],
      answerId: "b",
      explanation:
        "Custom error classes carry fields; `instanceof` (with realm caveats) narrows so you can read those fields safely.",
    },
  ],
};
