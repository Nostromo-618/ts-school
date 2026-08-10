import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "where-types-end",
  title: "Where your types stop",
  tier: "beginner",
  track: "runtime-boundary",
  order: 2,
  summary:
    "Types describe your program, not the network — the boundary between trusted and untrusted values is where TypeScript's guarantees end.",
  prerequisites: ["types-are-erased", "unknown-vs-any"],
  keywords: ["boundary", "untrusted input", "IO", "validation"],
  problem:
    "A request handler types req.body as a rich interface and then trusts every field without checking. Look at the left pane: no TypeScript error here — that's the point: the type ends at the assertion; runtime still lies. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "No TypeScript error here — that's the point: the type ends at the assertion; runtime still lies. Everything that crosses IO (HTTP, disk, env, queues) starts as untrusted. Types inside your process are only as true as the validations at the edge. Treat as Model and `any` as 'I stopped checking' — prefer `unknown` + parse. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
  js: {
    code: `function createUser(body) {
  return { id: body.id, admin: body.admin === true };
}

createUser(JSON.parse('{"id":"1","admin":"true"}'));
`,
    highlights: [{ start: 5, end: 5 }],
    caption: '`String` "true" is not boolean true — authz bug.',
  },
  ts: {
    code: `type CreateUser = { id: string; admin: boolean };

function createUser(body: CreateUser): CreateUser {
  return { id: body.id, admin: body.admin };
}

// Looks typed. The bytes still came from outside the program.
const body = JSON.parse('{"id":"1","admin":"true"}') as CreateUser;
createUser(body);
`,
    highlights: [{ start: 8, end: 8 }],
    caption:
      "No TypeScript error here — that's the point: the type ends at the assertion; runtime still lies.",
    expectedDiagnostics: [],
  },
  insight: [
    "Everything that crosses IO (HTTP, disk, env, queues) starts as untrusted.",
    "Types inside your process are only as true as the validations at the edge.",
    "Treat as Model and `any` as 'I stopped checking' — prefer `unknown` + parse.",
  ],
  security: {
    title: "Typed handlers are not validated handlers",
    body: "Attackers send JSON that `satisfies` your hopes, not your types. Never authorize from fields that were only asserted.",
    severity: "critical",
  },
  quiz: [
    {
      id: "q1",
      prompt: "Where do static types stop protecting you?",
      choices: [
        { id: "a", text: "At process boundaries / untrusted input" },
        { id: "b", text: "Inside pure functions" },
        { id: "c", text: "When using const" },
        { id: "d", text: "Never" },
      ],
      answerId: "a",
      explanation: "External data is not produced by the type checker.",
    },
  ],
  exercise: {
    prompt: "Accept `unknown` and narrow before createUser.",
    starter: `type CreateUser = { id: string; admin: boolean };

function createUser(body: CreateUser): CreateUser {
  return { id: body.id, admin: body.admin };
}

function parseCreateUser(input: unknown): CreateUser | null {
  if (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "admin" in input &&
    typeof (input as CreateUser).id === "string" &&
    typeof (input as CreateUser).admin === "boolean"
  ) {
    return input as CreateUser;
  }
  return null;
}

const body = JSON.parse('{"id":"1","admin":true}') as CreateUser;
createUser(body);
`,
    assertion: "no-errors",
    hints: [
      "const parsed = parseCreateUser(...); if (parsed) createUser(parsed);",
    ],
    solution: `type CreateUser = { id: string; admin: boolean };

function createUser(body: CreateUser): CreateUser {
  return { id: body.id, admin: body.admin };
}

function parseCreateUser(input: unknown): CreateUser | null {
  if (
    typeof input === "object" &&
    input !== null &&
    "id" in input &&
    "admin" in input &&
    typeof (input as CreateUser).id === "string" &&
    typeof (input as CreateUser).admin === "boolean"
  ) {
    return input as CreateUser;
  }
  return null;
}

const body: unknown = JSON.parse('{"id":"1","admin":true}');
const parsed = parseCreateUser(body);
if (parsed) createUser(parsed);
`,
  },
};
