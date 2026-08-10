import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "result-types",
  title: "Returning failures instead of throwing",
  tier: "intermediate",
  track: "async",
  order: 8,
  summary:
    "A `Result` union puts failure in the return type so the checker can insist you handle it — with real costs you should weigh.",
  prerequisites: ["discriminated-unions", "catch-gives-you-unknown"],
  keywords: ["Result", "Either", "ok", "err", "typed errors", "neverthrow"],
  problem:
    'A parser returns `null` on both "empty document" and "invalid JSON". Callers cannot tell which happened, so they either over-retry or show the wrong empty state. Separately, nothing in a throwing API\'s signature lists what can fail, so error handling is guesswork by reading the implementation. Collapsing outcomes into `null` or invisible throws is the fragile pattern.',
  solution:
    "Model outcomes as a discriminated `Result` — `{ ok: true; value } | { ok: false; error }` — so `.value` only exists after you check `ok`. The TypeScript pane rejects reading `.value` on the unresolved union; that is the point. Prefer Result when failure is ordinary control flow callers must handle; keep throwing for truly exceptional paths. Structure error payloads for logging, and do not invent a new Result dialect per module.",
  js: {
    code: `function parse(x) { try { return JSON.parse(x); } catch { return null; } }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: '`null` collapses "empty" and "failed" into one useless signal.',
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
    caption:
      "Discriminated `Result` — `.value` only exists on the `ok` branch.",
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
