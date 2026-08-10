import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "branded-validated-types",
  title: "Types only a validator can mint",
  tier: "advanced",
  track: "runtime-boundary",
  order: 14,
  summary:
    "Brand the output of a parser so an Email can only be produced by the function that checked it — validation you cannot forget to call.",
  prerequisites: ["branded-and-nominal-types", "parse-dont-validate"],
  keywords: [
    "branded type",
    "smart constructor",
    "validation",
    "Email",
    "opaque",
  ],
  problem:
    "Validation happens at the edge and the value travels for another twenty functions, any of which may construct a fresh unvalidated one. Nothing stops calling send with an unchecked string.",
  solution:
    "Only parseEmail mints Email — raw strings are rejected. Smart constructors return branded types; public APIs accept only the brand. Keep the brand key unexported so callers cannot forge values with object literals easily. Pair with runtime parsing — the brand is a compile-time receipt for a check that already ran.",
  js: {
    code: `// JS: validate once, then pass raw strings everywhere.
function isEmail(s) {
  return s.includes("@");
}
function send(to) {
  console.log("mail", to);
}
const raw = "not-an-email";
if (isEmail(raw)) send(raw);
send(raw); // also works — validation was optional
`,
    highlights: [{ start: 9, end: 10 }],
    caption: "Nothing stops calling send with an unchecked string.",
  },
  ts: {
    code: `declare const emailBrand: unique symbol;
type Email = string & { readonly [emailBrand]: void };

function parseEmail(input: string): Email | null {
  if (!input.includes("@")) return null;
  return input as Email;
}

function send(to: Email) {
  void to;
}

const raw = "not-an-email";
const parsed = parseEmail(raw);
if (parsed) send(parsed);

send(raw);
`,
    highlights: [{ start: 16, end: 16 }],
    caption: "Only parseEmail mints Email — raw strings are rejected.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 17,
        messageIncludes: "Email",
      },
    ],
  },
  insight: [
    "Smart constructors return branded types; public APIs accept only the brand.",
    "Keep the brand key unexported so callers cannot forge values with object literals easily.",
    "Pair with runtime parsing — the brand is a compile-time receipt for a check that already ran.",
  ],
  security: {
    title: "Unvalidated construction is a trust failure",
    body: "If any module can `as Email` without parsing, the brand is theatre. Restrict minting to one parser and treat other assertions as security-sensitive.",
    severity: "critical",
  },
  quiz: [
    {
      id: "brand-val",
      prompt: "What should be the only way to obtain an Email?",
      choices: [
        { id: "a", text: "string interpolation" },
        {
          id: "b",
          text: "A parser/smart constructor that validates then brands",
        },
        { id: "c", text: "`JSON.parse`" },
        { id: "d", text: "`process.env`" },
      ],
      answerId: "b",
      explanation:
        "The brand must be minted only after a successful validation.",
    },
  ],
  exercise: {
    prompt:
      'Define UserId brand and parseUserId(s: string): UserId | `null` requiring s.startsWith("user_").',
    starter: `type UserId = string;
function parseUserId(s: string): UserId | null {
  return s as UserId;
}
`,
    assertion: "no-errors",
    hints: [
      "Use a unique symbol brand; return `null` when the prefix is missing.",
    ],
    solution: `declare const userIdBrand: unique symbol;
type UserId = string & { readonly [userIdBrand]: void };

function parseUserId(s: string): UserId | null {
  if (!s.startsWith("user_")) return null;
  return s as UserId;
}

void parseUserId("user_1");
`,
  },
};
