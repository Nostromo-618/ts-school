import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "parse-dont-validate",
  title: "Parse, don't validate",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 11,
  summary:
    "Return the narrowed value rather than a boolean, so the proof travels with the data and cannot be forgotten one caller later.",
  prerequisites: ["schema-validation-libraries", "discriminated-unions"],
  keywords: [
    "parse don't validate",
    "illegal states",
    "modelling",
    "narrowing",
    "design",
  ],
  problem:
    "Boolean validation — the proof does not travel with the value. Types erase at runtime, so a boundary annotation without a check is a claim, not a proof. Parse or validate before you trust fields — especially for JSON, HTTP, and env. Validate before field access — annotations are not runtime checks.",
  solution:
    "Parsing returns Email | `null`. Passing a plain string to send is a type error. Validation asks a question; parsing produces a value whose type encodes the answer. Branded types (or dedicated interfaces) stop raw strings from entering privileged APIs. Prefer `parseX(`unknown`): X | error` over `isX` + unchecked use at every call site. Let inference work locally; annotate what crosses modules.",
  js: {
    code: `function isEmail(value) {
  return typeof value === "string" && value.includes("@");
}

function send(value) {
  if (!isEmail(value)) return;
  // value is still "whatever" to the next maintainer.
  return value.toLowerCase();
}
`,
    highlights: [{ start: 6, end: 9 }],
    caption: "Boolean validation — the proof does not travel with the value.",
  },
  ts: {
    code: `type Email = string & { readonly __brand: "Email" };

function parseEmail(value: unknown): Email | null {
  if (typeof value !== "string" || !value.includes("@")) {
    return null;
  }
  return value as Email;
}

function send(email: Email): string {
  return email.toLowerCase();
}

declare const raw: unknown;
const parsed = parseEmail(raw);
if (parsed) {
  send(parsed);
}

// A bare string is not Email — call sites must parse first:
send("not-parsed@example.com");
`,
    highlights: [
      { start: 3, end: 3 },
      { start: 22, end: 22 },
    ],
    caption:
      "Parsing returns Email | `null`. Passing a plain string to send is a type error.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 21,
        messageIncludes: "Argument of type 'string' is not assignable to p",
      },
    ],
  },
  insight: [
    "Validation asks a question; parsing produces a value whose type encodes the answer.",
    "Branded types (or dedicated interfaces) stop raw strings from entering privileged APIs.",
    "Prefer `parseX(unknown): X | error` over `isX` + unchecked use at every call site.",
  ],
  security: {
    title: "Booleans do not protect the next function",
    body: "If one module calls `isValid` and another receives `string`, the check can be skipped. Make privileged functions require the parsed type so the typechecker enforces the boundary.",
    severity: "caution",
  },
  quiz: [
    {
      id: "pdv-1",
      prompt:
        "What is the advantage of `parseEmail` returning `Email | null` over `isEmail` returning boolean?",
      choices: [
        { id: "a", text: "It runs faster." },
        {
          id: "b",
          text: "Call sites that need Email must go through the parse path.",
        },
        { id: "c", text: "It avoids using `unknown`." },
      ],
      answerId: "b",
      explanation:
        "The parsed type becomes a requirement at API boundaries, so forgetting to check becomes a compile error.",
    },
  ],
};
