import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-request-handlers",
  title: "Request handlers lie",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 13,
  summary:
    "req.body, req.params, and req.query are typed as whatever the framework felt like — usually `any` or string. Making a handler honest without fighting the framework.",
  prerequisites: ["parse-dont-validate", "typing-http-servers"],
  keywords: [
    "express",
    "fastify",
    "req.body",
    "params",
    "handler",
    "validation",
  ],
  problem:
    "Express types req.body as `any`, so the most attacker-controlled value in the process is the least checked one. Destructuring req.body with no checks — role can be anything.",
  solution:
    "Parse body into CreateUserBody before insert. A cast still yields a string role — assigning to number fails. Type the framework request body as `unknown` (or leave it untyped) and parse in the handler or a middleware. admin. Generics on Express handlers are only as honest as the middleware that populated them.",
  js: {
    code: `function createUser(req, res) {
  const { email, role } = req.body;
  db.insert({ email, role });
  res.status(201).end();
}
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Destructuring req.body with no checks — role can be anything.",
  },
  ts: {
    code: `type CreateUserBody = { email: string; role: "user" | "admin" };

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parseCreateUserBody(input: unknown): ParseResult<CreateUserBody> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "body required" };
  }
  const rec = input as Record<string, unknown>;
  if (typeof rec.email !== "string" || !rec.email.includes("@")) {
    return { ok: false, error: "invalid email" };
  }
  if (rec.role !== "user" && rec.role !== "admin") {
    return { ok: false, error: "invalid role" };
  }
  return { ok: true, value: { email: rec.email, role: rec.role } };
}

// Framework-shaped stub (body is unknown — never any).
type Request = { body: unknown };
type Response = { status: (code: number) => { end: () => void } };
declare function insertUser(row: CreateUserBody): void;

export function createUser(req: Request, res: Response): void {
  const parsed = parseCreateUserBody(req.body);
  if (!parsed.ok) {
    res.status(400).end();
    return;
  }
  insertUser(parsed.value);
  res.status(201).end();
}

// The anti-pattern frameworks encourage:
export function unsafe(req: Request): void {
  const body = req.body as CreateUserBody;
  insertUser(body);
}

declare const raw: unknown;
const role: "user" | "admin" = (raw as CreateUserBody).role;
const asNumber: number = role;
`,
    highlights: [
      { start: 32, end: 35 },
      { start: 44, end: 44 },
    ],
    caption:
      "Parse body into CreateUserBody before insert. A cast still yields a string role — assigning to number fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 44,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Type the framework request body as `unknown` (or leave it untyped) and parse in the handler or a middleware.",
    'Allowlisting role literals at parse time stops privilege escalation via "admin" in JSON.',
    "Generics on Express handlers are only as honest as the middleware that populated them.",
  ],
  security: {
    title: "req.body is attacker-controlled",
    body: "Treat body, query, and params as hostile. Parse into a dedicated input type before authorization or persistence. Never spread raw body into database rows or HTML templates.",
    severity: "critical",
  },
  exercise: {
    prompt:
      "Write parseIdParam(input: `unknown`): ParseResult<string> that accepts non-empty strings.",
    starter: `type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parseIdParam(input: unknown): ParseResult<string> {
  return { ok: false, error: "TODO" };
}
`,
    assertion: "no-errors",
    solution: `type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parseIdParam(input: unknown): ParseResult<string> {
  if (typeof input !== "string" || input.length === 0) {
    return { ok: false, error: "id required" };
  }
  return { ok: true, value: input };
}
`,
  },
};
