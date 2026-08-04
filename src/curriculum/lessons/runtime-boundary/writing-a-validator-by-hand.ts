import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "writing-a-validator-by-hand",
  title: "A validator you can read",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 8,
  summary:
    "Building an honest object validator from unknown up: property presence, primitive checks, arrays, and the error messages that make it usable.",
  prerequisites: ["assertion-functions", "array-narrowing"],
  keywords: [
    "validator",
    "parsing",
    "unknown",
    "runtime check",
    "error message",
  ],
  problem:
    "Every codebase writes this eventually, and the version written in a hurry checks the happy path only.",
  js: {
    code: `function parseUser(input) {
  return {
    id: input.id,
    roles: input.roles,
  };
}

const user = parseUser(JSON.parse('{"id":1}'));
user.roles.map((r) => r.toUpperCase());
`,
    highlights: [{ start: 2, end: 5 }],
    caption:
      "Happy-path mapping with no checks — missing roles blows up later.",
  },
  ts: {
    code: `type User = { id: string; roles: string[] };

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parseUser(input: unknown): ParseResult<User> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "expected object" };
  }
  const rec = input as Record<string, unknown>;
  if (typeof rec.id !== "string" || rec.id.length === 0) {
    return { ok: false, error: "id must be a non-empty string" };
  }
  if (!Array.isArray(rec.roles) || !rec.roles.every((r) => typeof r === "string")) {
    return { ok: false, error: "roles must be string[]" };
  }
  return { ok: true, value: { id: rec.id, roles: rec.roles } };
}

declare const body: unknown;
const parsed = parseUser(body);
if (parsed.ok) {
  const id: string = parsed.value.id;
}

// Fail closed: do not treat a failed parse as User
const leaked: User = parseUser(body) as User;
const bad: number = leaked.id;
`,
    highlights: [
      { start: 8, end: 8 },
      { start: 32, end: 33 },
    ],
    caption:
      "Return a result, not a cast. The deliberate lines show that forcing User still leaves id as string — assigning to number fails.",
    expectedDiagnostics: [
      {
        code: 2352,
        line: 28,
        messageIncludes: "Conversion of type 'ParseResult<User>' to type '",
      },
      {
        code: 2322,
        line: 29,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Validate every field you will read; skip nothing because 'the client is ours'.",
    "Return `{ ok, value } | { ok, error }` (or throw) so failure cannot be ignored as silently as a boolean.",
    "Build the output object from checked primitives — do not return the original unknown reference.",
  ],
  security: {
    title: "Validators must fail closed",
    body: "A partial check that returns the original object lets extra keys (`admin`, `__proto__`) ride through. Construct a new plain object with only known fields.",
    severity: "critical",
  },
  exercise: {
    prompt:
      "Complete `parsePort` so it accepts unknown and returns a ParseResult<number> for integers 1–65535.",
    starter: `type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parsePort(input: unknown): ParseResult<number> {
  return { ok: false, error: "TODO" };
}
`,
    assertion: "no-errors",
    hints: ["Reject non-numbers, non-integers, and out-of-range values."],
    solution: `type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parsePort(input: unknown): ParseResult<number> {
  if (typeof input !== "number" || !Number.isInteger(input)) {
    return { ok: false, error: "port must be an integer" };
  }
  if (input < 1 || input > 65535) {
    return { ok: false, error: "port out of range" };
  }
  return { ok: true, value: input };
}
`,
  },
};
