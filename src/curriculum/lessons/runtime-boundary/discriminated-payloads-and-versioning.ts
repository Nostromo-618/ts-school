import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "discriminated-payloads-and-versioning",
  title: "Evolving a wire format",
  tier: "advanced",
  track: "runtime-boundary",
  order: 15,
  summary:
    "Versioned message unions, forwards- and backwards-compatible shapes, and exhaustiveness checks that fail the build when a producer moves first.",
  prerequisites: ["exhaustiveness-checking", "parse-dont-validate"],
  keywords: ["versioning", "wire format", "message", "compatibility", "queue"],
  problem:
    "Missing version branches fail open in JS. Types erase at runtime, so a boundary annotation without a check is a claim, not a proof. Parse or validate before you trust fields — especially for JSON, HTTP, and env. Validate before field access — annotations are not runtime checks.",
  solution:
    "Passing a wider union into an older handler fails the build. Version discriminants belong on the wire; exhaustiveness forces consumer updates. Keep old versions in the union until the queue is drained — do not delete early. Parse `unknown` JSON into the versioned union before switching. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `// JS: consumers switch on version — miss a case, silent drop.
function handle(msg) {
  if (msg.v === 1) return msg.text;
  if (msg.v === 2) return msg.body;
  // v3 forgotten
}
`,
    highlights: [{ start: 2, end: 6 }],
    caption: "Missing version branches fail open in JS.",
  },
  ts: {
    code: `type MsgV1 = { v: 1; text: string };
type MsgV2 = { v: 2; body: string };
type Msg = MsgV1 | MsgV2;

function handle(msg: Msg): string {
  switch (msg.v) {
    case 1:
      return msg.text;
    case 2:
      return msg.body;
    default: {
      const _exhaustive: never = msg;
      return _exhaustive;
    }
  }
}

// New version without updating handle:
type MsgV3 = { v: 3; html: string };
type MsgAll = Msg | MsgV3;
function handleAll(msg: MsgAll): string {
  return handle(msg);
}
`,
    highlights: [{ start: 24, end: 24 }],
    caption: "Passing a wider union into an older handler fails the build.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 22,
        messageIncludes: "Msg",
      },
    ],
  },
  insight: [
    "Version discriminants belong on the wire; exhaustiveness forces consumer updates.",
    "Keep old versions in the union until the queue is drained — do not delete early.",
    "Parse `unknown` JSON into the versioned union before switching.",
  ],
  quiz: [
    {
      id: "ver-q",
      prompt: "Why keep MsgV1 in the union after shipping v2?",
      choices: [
        { id: "a", text: "TypeScript requires at least two members" },
        { id: "b", text: "In-flight and historical messages may still be v1" },
        { id: "c", text: "v1 is faster" },
        { id: "d", text: "Discriminants cannot be numbers" },
      ],
      answerId: "b",
      explanation:
        "Queues and logs retain older payloads; the consumer type must still describe them.",
    },
  ],
  exercise: {
    prompt:
      'Define Event = { type: "ping" } | { type: "pong"; n: number } and handle with exhaustiveness.',
    starter: `type Event = { type: "ping" } | { type: "pong"; n: number };
function handle(e: Event): string {
  return e.type;
}
`,
    assertion: "no-errors",
    hints: ["switch on e.type with default `never`."],
    solution: `type Event = { type: "ping" } | { type: "pong"; n: number };
function handle(e: Event): string {
  switch (e.type) {
    case "ping":
      return "ping";
    case "pong":
      return String(e.n);
    default: {
      const _x: never = e;
      return _x;
    }
  }
}
`,
  },
};
