import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "discriminated-unions",
  title: "Discriminated unions",
  tier: "intermediate",
  track: "types",
  order: 12,
  summary:
    "Give every member of a union a literal tag and the checker can tell them apart. This is the single most useful modelling pattern in TypeScript.",
  prerequisites: ["equality-narrowing", "object-type-literals"],
  keywords: [
    "discriminated union",
    "tagged union",
    "kind",
    "variant",
    "state machine",
  ],
  problem:
    "A result object with optional `data` and optional `error` lets you construct the impossible state where both are present — and callers that check `if (res.error)` still read `res.data` on the other path. Optional fields model the wrong thing: they allow mixes the domain never meant.",
  solution:
    'Give every variant a literal tag (`kind: "ok" | "err"`) so the checker can discriminate and expose only the fields that belong. The TypeScript pane rejects mixing `kind: "ok"` with an `error` property. Switch on the tag; with a finite set, exhaustiveness checking becomes possible. Prefer tagged unions over optional pairs whenever states are mutually exclusive.',
  js: {
    code: `function handle(res) {
  if (res.error) return res.error;
  return res.data.name;
}
handle({ data: { name: "a" }, error: "oops" });
`,
    highlights: [{ start: 1, end: 3 }],
    caption: "Optional fields allow both data and error at once.",
  },
  ts: {
    code: `type Ok = { kind: "ok"; data: { name: string } };
type Err = { kind: "err"; error: string };
type Result = Ok | Err;

function handle(res: Result): string {
  if (res.kind === "err") return res.error;
  return res.data.name;
}

const bad: Result = { kind: "ok", error: "nope" };
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "Tagged Result forbids mixing ok with error.",
    expectedDiagnostics: [
      {
        code: 2353,
        line: 10,
        messageIncludes: "Object literal may only specify known properties",
      },
    ],
  },
  insight: [
    "Give every variant a literal tag so the checker can discriminate.",
    "Optional data+error models allow impossible states.",
    "Switch on the tag and exhaustiveness checking becomes possible.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why put a literal `kind` (or similar) on every union member?",
      choices: [
        { id: "a", text: "It makes the object smaller at runtime" },
        {
          id: "b",
          text: "So the checker can tell variants apart and narrow fields",
        },
        { id: "c", text: "It disables excess property checks" },
        { id: "d", text: "It converts the union into an intersection" },
      ],
      answerId: "b",
      explanation:
        "A shared discriminant literal lets control-flow analysis pick one member and expose its fields safely.",
    },
  ],
};
