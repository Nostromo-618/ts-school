import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "optional-chaining-and-nullish",
  title: "Optional chaining and nullish coalescing",
  tier: "beginner",
  track: "types",
  order: 7,
  summary:
    "?. and ?? are runtime operators the type system understands: how each one changes the type of the expression around it.",
  prerequisites: ["null-and-undefined"],
  keywords: ["optional chaining", "nullish coalescing", "?.", "??"],
  problem:
    "|| treats 0 and the empty string as missing, so a default quietly overrides a legitimate value. Missing profile throws; empty email is replaced by ||. ?. short-circuits to `undefined` when the receiver is nullish.",
  solution:
    "Optional properties are `undefined` until you chain with ?. ?. short-circuits to `undefined` when the receiver is nullish. nobody@example.com. When the types name the contract, a quiet ship becomes a red squiggle at the call site instead.",
  js: {
    code: `function email(user) {
  return user.profile.email || "nobody@example.com";
}

email({ profile: { email: "" } });
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Missing profile throws; empty email is replaced by ||.",
  },
  ts: {
    code: `type User = { profile?: { email?: string } };

function email(user: User): string {
  // profile and email may be missing — need ?. before reading.
  return user.profile.email ?? "nobody@example.com";
}
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Optional properties are `undefined` until you chain with ?.",
    expectedDiagnostics: [{ code: 18048, line: 5, messageIncludes: "profile" }],
  },
  insight: [
    "?. short-circuits to `undefined` when the receiver is nullish.",
    '?? defaults only for `null` and `undefined` — keep 0 and "".',
    'Combine them: user.profile?.email ?? "nobody@example.com".',
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does 0 ?? 3000 evaluate to?",
      choices: [
        { id: "a", text: "3000" },
        { id: "b", text: "0" },
        { id: "c", text: "`undefined`" },
        { id: "d", text: "NaN" },
      ],
      answerId: "b",
      explanation: "0 is not nullish, so ?? returns the left side.",
    },
  ],
  exercise: {
    prompt: "Use optional chaining so email type-checks.",
    starter: `type User = { profile?: { email?: string } };

function email(user: User): string {
  return user.profile.email ?? "nobody@example.com";
}
`,
    assertion: "no-errors",
    hints: ["user.profile?.email ?? ..."],
    solution: `type User = { profile?: { email?: string } };

function email(user: User): string {
  return user.profile?.email ?? "nobody@example.com";
}
`,
  },
};
