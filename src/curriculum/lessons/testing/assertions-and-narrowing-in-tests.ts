import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "assertions-and-narrowing-in-tests",
  title: "Assertions that narrow",
  tier: "intermediate",
  track: "testing",
  order: 3,
  summary:
    "expect(x).toBeDefined() proves nothing to the compiler. Which assertions narrow, which do not, and how to bridge the gap without casting.",
  prerequisites: ["typing-your-test-files", "assertion-functions"],
  keywords: ["assertion", "narrowing", "toBeDefined", "non-null", "expect"],
  problem:
    "Every line after a truthiness assertion still sees the nullable type, so tests fill up with bangs.",
  js: {
    code: `expect(user).toBeDefined();
expect(user.id).toBe('1');
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Jest expects do not narrow TypeScript types.",
  },
  ts: {
    code: `type User = { id: string };
declare function expectDefined<T>(x: T | null | undefined): asserts x is T;
declare const user: User | undefined;
expectDefined(user);
const id: string = user.id;
const bad: number = user.id;
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Assertion functions narrow after expectDefined. id is string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Runtime expects do not narrow TS types unless you wrap them.",
    "asserts x is T bridges test asserts into control flow.",
    "Alternatively assign after a guard.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Does expect(user).toBeDefined() narrow user for TypeScript?",
      choices: [
        { id: "a", text: "Yes — the checker understands Jest matchers" },
        {
          id: "b",
          text: "No — wrap with an asserts function or assign after a guard",
        },
        { id: "c", text: "Only under strictNullChecks" },
        { id: "d", text: "Only when user is any" },
      ],
      answerId: "b",
      explanation:
        "Matcher libraries prove things at runtime; TypeScript needs asserts x is T (or a local guard) to narrow.",
    },
  ],
};
