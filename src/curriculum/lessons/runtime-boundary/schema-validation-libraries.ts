import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "schema-validation-libraries",
  title: "Schemas as the source of truth",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 9,
  summary:
    "Zod, Valibot, ArkType, TypeBox: `declare` the schema, `infer the` type from it. The direction of that arrow is what stops the two from drifting.",
  prerequisites: ["writing-a-validator-by-hand", "typeof-type-queries"],
  keywords: [
    "zod",
    "valibot",
    "schema",
    "infer",
    "validation",
    "standard schema",
  ],
  problem:
    "A hand-written interface and a hand-written validator describe the same shape twice, and only one of them gets updated. Look at the left pane: two sources of truth — the typedef and the runtime checks — drift apart. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "User is inferred from the schema object. Assigning age (number) to string fails. One schema → inferred static type + runtime parse. Invert that and drift returns. Libraries differ in bundle size and error UX; the architecture (schema as source of truth) is the lesson. At trust boundaries, call `.parse` / safeParse — never `as User` on JSON. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
  js: {
    code: `// types.js — hope someone updates this when the validator changes
/** @typedef {{ id: string, age: number }} User */

function parseUser(input) {
  if (typeof input?.id !== "string") throw new Error("bad id");
  // forgot to check age
  return input;
}
`,
    highlights: [{ start: 6, end: 8 }],
    caption:
      "Two sources of truth — the typedef and the runtime checks — drift apart.",
  },
  ts: {
    code: `// Minimal schema-shaped API (stands in for Zod/Valibot in the sandbox).
type Infer<S> = S extends { __type: infer T } ? T : never;

type StrSchema = { kind: "string"; __type: string };
type NumSchema = { kind: "number"; __type: number };
type ObjSchema<S extends Record<string, { __type: unknown }>> = {
  kind: "object";
  shape: S;
  __type: { [K in keyof S]: Infer<S[K]> };
};

const str = (): StrSchema => ({ kind: "string", __type: "" as string });
const num = (): NumSchema => ({ kind: "number", __type: 0 as number });
function obj<S extends Record<string, { __type: unknown }>>(
  shape: S,
): ObjSchema<S> {
  return { kind: "object", shape, __type: null as never };
}

const userSchema = obj({ id: str(), age: num() });
type User = Infer<typeof userSchema>;

function parse<S extends { __type: unknown; kind: string }>(
  schema: S,
  input: unknown,
): Infer<S> {
  // Runtime omitted — libraries own this. Types flow from the schema.
  return input as Infer<S>;
}

const user: User = parse(userSchema, { id: "a", age: 2 });
const age: string = user.age;
`,
    highlights: [
      { start: 24, end: 25 },
      { start: 36, end: 36 },
    ],
    caption:
      "User is inferred from the schema object. Assigning age (number) to string fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 32,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "One schema → inferred static type + runtime parse. Invert that and drift returns.",
    "Libraries differ in bundle size and error UX; the architecture (schema as source of truth) is the lesson.",
    "At trust boundaries, call `.parse` / safeParse — never `as User` on JSON.",
  ],
  security: {
    title: "Inferred types are only as safe as the parse you run",
    body: "Importing `z.infer<typeof schema>` without calling `schema.parse` at the boundary is the same as a cast. The library helps only when you execute it on untrusted input.",
    severity: "caution",
  },
  quiz: [
    {
      id: "svl-1",
      prompt:
        "Why `infer the` type from the schema instead of writing both by hand?",
      choices: [
        { id: "a", text: "Inference is required by Node." },
        {
          id: "b",
          text: "So runtime checks and static types cannot silently disagree.",
        },
        { id: "c", text: "It removes the need to validate at runtime." },
      ],
      answerId: "b",
      explanation:
        "A single source of truth keeps the checker and the validator describing the same shape.",
    },
  ],
};
