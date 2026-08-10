import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typed-error-channels",
  title: "Typed error channels",
  tier: "advanced",
  track: "async",
  order: 16,
  summary:
    "Separate typed success data from typed error channels — do not overload one field to mean both.",
  prerequisites: [
    "discriminated-results-in-practice",
    "higher-order-generic-signatures",
  ],
  keywords: [
    "Effect",
    "neverthrow",
    "typed errors",
    "error channel",
    "interop",
  ],
  problem:
    "An API response type uses one `data` field that is either the payload or an error string depending on status. Callers read `data.name` on error responses and ship nonsense or crash. Overloading a single channel to carry two meanings is the failure mode — the type lies about what is present.",
  solution:
    "Give success and failure distinct fields (or distinct union members) so the checker can see which channel is live. Discriminate on status or `ok`, then read only the fields that belong to that branch. The TypeScript pane should make the illegal mix a diagnostic, not a production surprise. Keep error channels structured and boring; do not reuse payload property names for diagnostics.",
  js: {
    code: `// JS: errors are thrown values — catch whatever.
async function load() {
  throw new Error("network");
}
try {
  await load();
} catch (e) {
  console.log(e.message);
}
`,
    highlights: [{ start: 5, end: 8 }],
    caption: "One overloaded field cannot safely mean both payload and error.",
  },
  ts: {
    code: `type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type NetErr = { kind: "network"; cause: string };

async function load(): Promise<Result<{ id: string }, NetErr>> {
  return { ok: false, error: { kind: "network", cause: "timeout" } };
}

const r = await load();
if (!r.ok) {
  const k: "network" = r.error.kind;
  void k;
} else {
  const n: number = r.value.id;
  void n;
}
`,
    highlights: [{ start: 16, end: 16 }],
    caption: "Separate channels make illegal mixes a type error.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 16,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Typed error channels make failure part of the signature — callers must handle or propagate E.",
    "Interop cost: thrown exceptions and Result styles do not mix cleanly at boundaries.",
    "Adopt at module borders first; avoid dual styles inside one feature.",
  ],
  quiz: [
    {
      id: "err-chan",
      prompt: "Main benefit of Result<T, E> over throw?",
      choices: [
        { id: "a", text: "Faster runtime" },
        {
          id: "b",
          text: "The error type appears in the signature for callers",
        },
        { id: "c", text: "It disables try/catch" },
        { id: "d", text: "It removes async" },
      ],
      answerId: "b",
      explanation:
        "E is visible to typechecking; thrown Error is usually `unknown` in catch.",
    },
  ],
  exercise: {
    prompt:
      "Define Result<T, E> and a function ok(value: T): Result<T, never>.",
    starter: `type Result<T, E> = unknown;
`,
    assertion: "no-errors",
    hints: ["Discriminated union with ok: true | false."],
    solution: `type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

void ok(1);
`,
  },
};
