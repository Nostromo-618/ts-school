import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-your-test-files",
  title: "Typing the tests themselves",
  tier: "beginner",
  track: "testing",
  order: 1,
  summary:
    "Tests are TypeScript too — typed asserts and fixtures catch API drift before the suite becomes a museum of any.",
  prerequisites: ["first-type-error", "annotations-vs-inference"],
  keywords: ["tests", "vitest", "expect", "types in tests"],
  problem:
    "Test helpers take any and return any, so a renamed production field only fails in production.",
  js: {
    code: `function expectUser(value) {
  if (!value || typeof value.id !== "string") throw new Error("bad");
  return value;
}

expectUser({ id: 1 }).id.toUpperCase();
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "The helper 'passed' a bad fixture into a string API.",
  },
  ts: {
    code: `type User = { id: string };

function expectUser(value: unknown): User {
  if (
    !value ||
    typeof value !== "object" ||
    !("id" in value) ||
    typeof (value as User).id !== "string"
  ) {
    throw new Error("bad");
  }
  return value as User;
}

const fixture: User = { id: 1 };
expectUser(fixture).id.toUpperCase();
`,
    highlights: [{ start: 15, end: 15 }],
    caption: "Typed fixtures refuse the bad id at compile time.",
    expectedDiagnostics: [{ code: 2322, line: 15, messageIncludes: "number" }],
  },
  insight: [
    "Include tests in the same tsconfig (or a project reference) so they typecheck in CI.",
    "Prefer unknown + narrowing helpers over any in test utils.",
    "When production types change, failing tests should be type errors first.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why type test fixtures?",
      choices: [
        { id: "a", text: "Tests run faster" },
        {
          id: "b",
          text: "API renames break at compile time instead of only at assert",
        },
        { id: "c", text: "Vitest requires it" },
        { id: "d", text: "It disables mocks" },
      ],
      answerId: "b",
      explanation: "Typed fixtures track production types.",
    },
  ],
  exercise: {
    prompt: "Pass a string id in the fixture.",
    starter: `type User = { id: string };

function expectUser(value: unknown): User {
  if (
    !value ||
    typeof value !== "object" ||
    !("id" in value) ||
    typeof (value as User).id !== "string"
  ) {
    throw new Error("bad");
  }
  return value as User;
}

const fixture: User = { id: 1 };
expectUser(fixture).id.toUpperCase();
`,
    assertion: "no-errors",
    hints: ['id: "1"'],
    solution: `type User = { id: string };

function expectUser(value: unknown): User {
  if (
    !value ||
    typeof value !== "object" ||
    !("id" in value) ||
    typeof (value as User).id !== "string"
  ) {
    throw new Error("bad");
  }
  return value as User;
}

const fixture: User = { id: "1" };
expectUser(fixture).id.toUpperCase();
`,
  },
};
