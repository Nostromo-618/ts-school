import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-assertions-are-claims",
  title: "as is a claim, not a check",
  tier: "beginner",
  track: "runtime-boundary",
  order: 4,
  summary:
    "Type assertions tell the checker to trust you. They do not convert values and they do not validate shapes.",
  prerequisites: ["where-types-end", "unknown-vs-any"],
  keywords: ["assertion", "as", "angle-bracket", "cast"],
  problem:
    "Developers 'fix' a type error with as Type and ship a value that never matched Type.",
  js: {
    code: `function asUser(value) {
  return value; // "trust me"
}

asUser(null).email;
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "A mental cast does nothing at runtime.",
  },
  ts: {
    code: `type User = { email: string };

function load(): User {
  const raw: unknown = null;
  return raw as User;
}

load().email.toLowerCase();
`,
    highlights: [{ start: 5, end: 5 }],
    caption:
      "No TypeScript error here — that's the point: the assertion skipped the check. Compiles. Crashes.",
    expectedDiagnostics: [],
  },
  insight: [
    "as Type is a compile-time claim; prefer narrowing that the checker can verify.",
    "Double assertions (as unknown as T) are a smell — usually a wrong model.",
    "Use assertions for DOM/legacy interop after you have a real reason, not to silence errors.",
  ],
  security: {
    title: "Assertions bypass the boundary",
    body: "as User on request data is equivalent to disabling the type system for that value. Validate first.",
    severity: "critical",
  },
  quiz: [
    {
      id: "q1",
      prompt: "Does `value as User` validate fields at runtime?",
      choices: [
        { id: "a", text: "Yes" },
        { id: "b", text: "No" },
        { id: "c", text: "Only under strict" },
        { id: "d", text: "Only for interfaces" },
      ],
      answerId: "b",
      explanation: "Assertions erase; no runtime check is inserted.",
    },
  ],
  exercise: {
    prompt: "Return a real User or throw instead of asserting null.",
    starter: `type User = { email: string };

function load(): User {
  const raw: unknown = null;
  return raw as User;
}
`,
    assertion: "no-errors",
    hints: ['if (!raw || typeof raw !== "object") throw ...; check email'],
    solution: `type User = { email: string };

function load(): User {
  const raw: unknown = { email: "a@b.co" };
  if (
    typeof raw === "object" &&
    raw !== null &&
    "email" in raw &&
    typeof (raw as User).email === "string"
  ) {
    return { email: (raw as User).email };
  }
  throw new Error("invalid user");
}
`,
  },
};
