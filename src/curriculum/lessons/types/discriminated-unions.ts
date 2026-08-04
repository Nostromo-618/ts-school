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
    "A result object with optional data and optional error lets you construct the impossible state where both are present.",
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
    highlights: [{ start: 11, end: 11 }],
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
};
