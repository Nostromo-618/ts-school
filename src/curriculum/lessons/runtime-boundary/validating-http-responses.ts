import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "validating-http-responses",
  title: "Validating what came back",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 10,
  summary:
    "fetch gives you `any`, your API client gives you confidence, and neither gives you a guarantee. Where the parse belongs in a request pipeline.",
  prerequisites: ["schema-validation-libraries", "async-await-typing"],
  keywords: [
    "fetch",
    "http",
    "response",
    "api client",
    "validation",
    "boundary",
  ],
  problem:
    "An upstream service renames a field and your typed client keeps compiling, all the way to the `undefined` that reaches the user. Look at the left pane: json() is unchecked — a renamed field becomes a runtime TypeError. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Parse the body before reading fields. Casting unknown to UserDto still leaves name as string — number assign fails. Wire types (DTO) are untrusted even when 'our' service produced them — deploys drift. Put parseUserDto (or schema.parse) immediately after `JSON.parse` / res.json(). `as UserDto` on a response compiles forever and fails at the worst time. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
  js: {
    code: `async function getUser(id) {
  const res = await fetch("/api/users/" + id);
  const data = await res.json();
  return data.name.toUpperCase();
}
`,
    highlights: [{ start: 3, end: 4 }],
    caption:
      "json() is unchecked — a renamed field becomes a runtime TypeError.",
  },
  ts: {
    code: `type UserDto = { id: string; name: string };

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parseUserDto(input: unknown): ParseResult<UserDto> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "not an object" };
  }
  const rec = input as Record<string, unknown>;
  if (typeof rec.id !== "string" || typeof rec.name !== "string") {
    return { ok: false, error: "invalid user dto" };
  }
  return { ok: true, value: { id: rec.id, name: rec.name } };
}

// Teaching stub — no DOM fetch in the sandbox libs.
declare function readJsonBody(): Promise<unknown>;

export async function getUserName(): Promise<string> {
  const body = await readJsonBody();
  const parsed = parseUserDto(body);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }
  return parsed.value.name.toUpperCase();
}

// Trusting json without parsing:
export async function naive(): Promise<string> {
  const body = await readJsonBody();
  const user = body as UserDto;
  return user.name.toUpperCase();
}

declare const maybe: unknown;
const n: number = (maybe as UserDto).name;
`,
    highlights: [
      { start: 28, end: 31 },
      { start: 38, end: 38 },
    ],
    caption:
      "Parse the body before reading fields. Casting unknown to UserDto still leaves name as string — number assign fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 38,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Wire types (DTO) are untrusted even when 'our' service produced them — deploys drift.",
    "Put parseUserDto (or schema.parse) immediately after `JSON.parse` / res.json().",
    "`as UserDto` on a response compiles forever and fails at the worst time.",
  ],
  security: {
    title: "Responses are an inbound trust boundary",
    body: "Man-in-the-middle, compromised dependencies, and shared staging clusters can alter payloads. Treat HTTP JSON like user input: parse before use, especially before feeding it into authz or HTML.",
    severity: "caution",
  },
};
