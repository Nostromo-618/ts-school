import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "user-defined-type-guards",
  title: "User-defined type guards",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 6,
  summary:
    "A predicate that returns `value is T` teaches the checker what a runtime check proved — without casting.",
  prerequisites: ["unknown-vs-any", "narrowing-with-typeof"],
  keywords: ["type guard", "is", "predicate", "narrowing", "unknown"],
  problem:
    "After `typeof x === 'string'` you know it is a string; after a custom `isUser(x)` check JavaScript still treats x as `unknown` unless you tell TypeScript.",
  js: {
    code: `function isUser(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.email === "string"
  );
}

function handle(payload) {
  if (isUser(payload)) {
    // Still a guess — nothing stopped a caller from lying.
    return payload.email.toLowerCase();
  }
  return null;
}
`,
    highlights: [{ start: 12, end: 14 }],
    caption:
      "A runtime check with no type predicate — the body still trusts shape by faith.",
  },
  ts: {
    code: `type User = { id: string; email: string };

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    typeof (value as { id: unknown }).id === "string" &&
    typeof (value as { email: unknown }).email === "string"
  );
}

function handle(payload: unknown): string | null {
  if (isUser(payload)) {
    return payload.email.toLowerCase();
  }
  return null;
}

declare const untrusted: unknown;
// Without a guard, User fields are not known:
const oops: string = (untrusted as User).missing;
`,
    highlights: [
      { start: 3, end: 3 },
      { start: 27, end: 27 },
    ],
    caption:
      "`value is User` narrows inside the `if`. Accessing a non-existent field on a claimed User still fails.",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 23,
        messageIncludes: "Property 'missing' does not exist on type 'User'",
      },
    ],
  },
  insight: [
    "`value is T` is a contract: if the function returns true, the checker treats the argument as T in that branch.",
    "The guard body must actually check what T requires — a lying predicate is a security bug dressed as a type.",
    "Prefer guards over `as T` at trust boundaries; casts skip the proof.",
  ],
  security: {
    title: "Type predicates are claims your runtime must honour",
    body: "A guard that returns true for incomplete objects lets attackers reach code paths that assume full User fields. Keep checks complete, and `never` implement `value is T` with a bare `return true`.",
    severity: "critical",
  },
  quiz: [
    {
      id: "udtg-1",
      prompt:
        "What does `function isFoo(x: unknown): x is Foo` change for the checker?",
      choices: [
        { id: "a", text: "It makes Foo exist at runtime." },
        {
          id: "b",
          text: "When the function returns true, x is narrowed to Foo in that scope.",
        },
        { id: "c", text: "It erases `unknown` from the whole file." },
      ],
      answerId: "b",
      explanation:
        "The predicate return type is a control-flow hint. Runtime behaviour is still whatever the function body does.",
    },
  ],
  exercise: {
    prompt:
      "Write `isPositiveNumber(value: unknown): value is number` that accepts finite numbers > 0. Then call `Math.sqrt` only inside the guard.",
    starter: `function isPositiveNumber(value: unknown): value is number {
  return false; // TODO: real check
}

export function rootOf(value: unknown): number | undefined {
  if (isPositiveNumber(value)) {
    return Math.sqrt(value);
  }
  return undefined;
}
`,
    assertion: "no-errors",
    hints: ["Check `typeof` === 'number', Number.isFinite, and value > 0."],
    solution: `function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function rootOf(value: unknown): number | undefined {
  if (isPositiveNumber(value)) {
    return Math.sqrt(value);
  }
  return undefined;
}
`,
  },
  references: [
    {
      title: "TypeScript Handbook — Type predicates",
      href: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
    },
  ],
};
