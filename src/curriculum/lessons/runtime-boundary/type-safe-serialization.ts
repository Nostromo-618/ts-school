import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-safe-serialization",
  title: "The round trip",
  tier: "advanced",
  track: "runtime-boundary",
  order: 18,
  summary:
    "Date, Map, Set, BigInt, and `undefined` do not survive JSON. Typing what comes back so it matches what is actually there.",
  prerequisites: ["generated-types-from-contracts", "utility-types-tour"],
  keywords: ["serialization", "JSON", "Date", "round trip", "Jsonify"],
  problem:
    "The wire shape is not the in-memory shape. Types erase at runtime, so a boundary annotation without a check is a claim, not a proof. Parse or validate before you trust fields — especially for JSON, HTTP, and env. Validate before field access — annotations are not runtime checks.",
  solution:
    "Jsonify maps Date to string — assigning a Date fails. Model wire types separately from domain types when JSON is involved. `undefined` keys disappear; Date becomes string; Map/Set become objects/arrays or fail. Revivers and custom serializers must stay in sync with Jsonify-like types. Prefer the smallest honest type that still rejects the bad input.",
  js: {
    code: `// JS: JSON.stringify drops undefined and turns Date into a string.
const payload = { at: new Date(), note: undefined };
JSON.parse(JSON.stringify(payload)); // { at: "2020-…" } — note gone
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "The wire shape is not the in-memory shape.",
  },
  ts: {
    code: `type Jsonify<T> = T extends Date
  ? string
  : T extends Array<infer U>
    ? Jsonify<U>[]
    : T extends object
      ? { [K in keyof T]: Jsonify<T[K]> }
      : T;

type Event = { at: Date; name: string };
type WireEvent = Jsonify<Event>;
// { at: string; name: string }

const wire: WireEvent = { at: new Date().toISOString(), name: "x" };
const bad: WireEvent = { at: new Date(), name: "x" };
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "Jsonify maps Date to string — assigning a Date fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 14,
        messageIncludes: "Date",
      },
    ],
  },
  insight: [
    "Model wire types separately from domain types when JSON is involved.",
    "`undefined` keys disappear; Date becomes string; Map/Set become objects/arrays or fail.",
    "Revivers and custom serializers must stay in sync with Jsonify-like types.",
  ],
  quiz: [
    {
      id: "jsonify-q",
      prompt: "After `JSON.stringify`/parse, what is a Date field?",
      choices: [
        { id: "a", text: "Still a Date instance" },
        { id: "b", text: "A string (ISO)" },
        { id: "c", text: "A number timestamp always" },
        { id: "d", text: "`null`" },
      ],
      answerId: "b",
      explanation: "JSON has no Date type; stringify uses toJSON → string.",
    },
  ],
  exercise: {
    prompt:
      "Define WireUser = { id: string; createdAt: string } matching a Jsonify of { id: string; createdAt: Date }.",
    starter: `type WireUser = { id: string; createdAt: Date };
`,
    assertion: "no-errors",
    hints: ["createdAt should be string on the wire."],
    solution: `type WireUser = { id: string; createdAt: string };
const w: WireUser = { id: "1", createdAt: "2020-01-01T00:00:00.000Z" };
void w;
`,
  },
};
