import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "result-types",
  title: "Returning failures instead of throwing",
  tier: "intermediate",
  track: "async",
  order: 8,
  summary:
    "A Result union puts the failure in the return type, where the checker can insist you handle it. The costs are real too.",
  prerequisites: ["discriminated-unions", "catch-gives-you-unknown"],
  keywords: ["Result", "Either", "ok", "err", "typed errors", "neverthrow"],
  problem:
    "Nothing in a signature says which of the forty functions below it can throw, so error handling is guesswork by inspection.",
  js: {
    code: `function parse(x) { try { return JSON.parse(x); } catch { return null; } }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "`null` means both empty and failure.",
  },
  ts: {
    code: `type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseJson(text: string): Result<unknown> {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, error: "invalid json" };
  }
}

const r = parseJson("{}");
if (r.ok) {
  const v: unknown = r.value;
}
const bad: string = parseJson("{}").value;
`,
    highlights: [{ start: 17, end: 17 }],
    caption: "Discriminated Result — .value only on ok. Direct access fails.",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 17,
        messageIncludes: "Property 'value' does not exist on type 'Result<",
      },
    ],
  },
  insight: [
    "Result types make failure explicit in the type.",
    "Prefer them when exceptions are control flow.",
    "Keep error payloads structured for logging.",
  ],
  exercise: {
    prompt: "Only read .value after checking r.ok. Match the solution text.",
    starter: `type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

declare function parseJson(text: string): Result<unknown>;

const r = parseJson("{}");
const v: unknown = r.value;
`,
    assertion: "no-errors",
    hints: ["if (r.ok) { const v = r.value; }"],
    solution: `type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

declare function parseJson(text: string): Result<unknown>;

const r = parseJson("{}");
if (r.ok) {
  const v: unknown = r.value;
  void v;
}
`,
  },
};
