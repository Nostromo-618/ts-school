import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typed-error-channels",
  title: "Typed error channels",
  tier: "advanced",
  track: "async",
  order: 16,
  summary:
    "Effect, neverthrow, and friends put the error type in the signature. What that buys, what it costs in interop, and how to decide.",
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
    "A typed-error library is all-or-nothing at a boundary, and half-adopted it produces two error models in one codebase.",
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
    caption: "Thrown errors have no channel in the type system.",
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
    caption: "Result puts errors in the return type — success fields stay narrow.",
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
        { id: "b", text: "The error type appears in the signature for callers" },
        { id: "c", text: "It disables try/catch" },
        { id: "d", text: "It removes async" },
      ],
      answerId: "b",
      explanation:
        "E is visible to typechecking; thrown Error is usually unknown in catch.",
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
