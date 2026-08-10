import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "assertion-functions",
  title: "Assertion functions",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 7,
  summary:
    "`asserts value is T` narrows after a successful return — useful for invariants, dangerous if used instead of parsing untrusted input.",
  prerequisites: ["user-defined-type-guards"],
  keywords: ["asserts", "assertion function", "invariant", "narrowing"],
  problem:
    "Throwing when a check fails does not change TypeScript's view of the value unless you mark the function as an assertion. Look at the left pane: runtime throw without an `asserts` signature — types ignore the check. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "After `assertUser`, `raw` is User. Calling `greet` without asserting still errors. `asserts value is T` means: if the function returns, value is T; if not, it threw. Use assertions for internal invariants you control — not as a substitute for parsing untrusted JSON. A lying assertion function (returns without checking) is trusted by the checker; that is a critical footgun. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
  js: {
    code: `function assertUser(value) {
  if (!value || typeof value.id !== "string") {
    throw new Error("not a user");
  }
}

function main(raw) {
  assertUser(raw);
  // Engine still treats raw as whatever it was — no narrowing.
  return raw.id.toUpperCase();
}
`,
    highlights: [{ start: 8, end: 10 }],
    caption:
      "Runtime throw without an `asserts` signature — types ignore the check.",
  },
  ts: {
    code: `type User = { id: string };

function assertUser(value: unknown): asserts value is User {
  if (
    typeof value !== "object" ||
    value === null ||
    typeof (value as { id?: unknown }).id !== "string"
  ) {
    throw new Error("not a user");
  }
}

function greet(user: User): string {
  return user.id.toUpperCase();
}

export function main(raw: unknown): string {
  assertUser(raw);
  return greet(raw);
}

// Without the assertion, unknown does not satisfy User:
export function bad(raw: unknown): string {
  return greet(raw);
}
`,
    highlights: [
      { start: 3, end: 3 },
      { start: 26, end: 27 },
    ],
    caption:
      "After `assertUser`, `raw` is User. Calling `greet` without asserting still errors.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 24,
        messageIncludes: "Argument of type 'unknown' is not assignable to",
      },
    ],
  },
  insight: [
    "`asserts value is T` means: if the function returns, value is T; if not, it threw.",
    "Use assertions for internal invariants you control — not as a substitute for parsing untrusted JSON.",
    "A lying assertion function (returns without checking) is trusted by the checker; that is a critical footgun.",
  ],
  security: {
    title: "Never assert untrusted input into a privileged type",
    body: "Assertion functions only change the checker; they do not produce a parsed value. On request bodies, env, or file input, parse and validate into a new object instead of asserting the raw `unknown`.",
    severity: "critical",
  },
  quiz: [
    {
      id: "af-1",
      prompt:
        "After `assertUser(raw)` where assertUser is `asserts value is User`, what is raw?",
      choices: [
        { id: "a", text: "Still `unknown`." },
        { id: "b", text: "User, if the function returned." },
        { id: "c", text: "`any`." },
      ],
      answerId: "b",
      explanation:
        "Control flow treats a successful return as proof of the asserted type.",
    },
  ],
};
