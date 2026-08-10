import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "generated-types-from-contracts",
  title: "Generating types from a contract",
  tier: "advanced",
  track: "runtime-boundary",
  order: 17,
  summary:
    "OpenAPI, protobuf, GraphQL, and SQL schemas can all emit TypeScript. What that guarantees, what it does not, and where the drift moves to.",
  prerequisites: ["schema-validation-libraries", "declaration-files-intro"],
  keywords: ["openapi", "protobuf", "graphql", "codegen", "contract", "drift"],
  problem:
    "Generated types describe the contract as it was when the generator last ran, which is not necessarily the contract the server is serving. Look at the left pane: no contract artifact means no mechanical sync. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Generated DTO types still need a parse step — casts lie. Codegen removes transcription bugs; it does not prove the server still matches. CI should regenerate and fail on drift, or validate responses at runtime. Prefer generating both types and validators from one schema when possible. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
  js: {
    code: `// JS: hand-written clients drift from the server silently.
async function getUser(id) {
  const res = await fetch("/users/" + id);
  return res.json();
}
`,
    highlights: [{ start: 2, end: 5 }],
    caption: "No contract artifact means no mechanical sync.",
  },
  ts: {
    code: `// Illustrative generated types — treat as a snapshot of the contract.
type UserDto = { id: string; email: string };

declare function getJson(url: string): Promise<unknown>;

// Runtime still returns unknown-shaped JSON unless you validate.
async function getUser(id: string): Promise<UserDto> {
  const data: unknown = await getJson("/users/" + id);
  return data as UserDto;
}

const u = await getUser("1");
const n: number = u.email;
`,
    highlights: [{ start: 13, end: 13 }],
    caption: "Generated DTO types still need a parse step — casts lie.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 13,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Codegen removes transcription bugs; it does not prove the server still matches.",
    "CI should regenerate and fail on drift, or validate responses at runtime.",
    "Prefer generating both types and validators from one schema when possible.",
  ],
  security: {
    title: "Generated types are not authentication of the payload",
    body: "A DTO type from OpenAPI does not validate JSON. Untrusted responses still need runtime checks before you trust fields like roles or prices.",
    severity: "caution",
  },
  quiz: [
    {
      id: "codegen-q",
      prompt: "What does OpenAPI→TS codegen guarantee by itself?",
      choices: [
        { id: "a", text: "Runtime response validation" },
        {
          id: "b",
          text: "Types matching the last generated contract snapshot",
        },
        { id: "c", text: "That production matches staging" },
        { id: "d", text: "That fetch cannot fail" },
      ],
      answerId: "b",
      explanation:
        "Generated types track the schema at generation time — not live servers.",
    },
  ],
  exercise: {
    prompt:
      "Define OrderDto with id: string and totalCents: number. Write a function that accepts OrderDto.",
    starter: `type OrderDto = { id: string };
function charge(order: OrderDto) {
  void order;
}
`,
    assertion: "no-errors",
    hints: ["Add totalCents: number."],
    solution: `type OrderDto = { id: string; totalCents: number };
function charge(order: OrderDto) {
  void order.totalCents;
}
charge({ id: "o1", totalCents: 100 });
`,
  },
};
