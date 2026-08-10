import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typed-fixtures-and-factories",
  title: "Fixtures that cannot drift",
  tier: "beginner",
  track: "testing",
  order: 2,
  summary:
    "Factory functions returning Satisfies/typed objects keep fixtures aligned with production types as fields evolve.",
  prerequisites: ["typing-your-test-files", "object-type-literals"],
  keywords: ["factory", "fixture", "satisfies", "test data"],
  problem:
    "Overrides are unchecked; email becomes a number. A test that compiles while asserting the wrong contract is worse than no test: it freezes the bug in CI. Type the fixture and the expectation so the checker helps the assertion. Type the assertion so a wrong expectation fails compilation.",
  solution:
    "`Partial<User>` still requires override values to match field types. Type factories as returning the production type, not a looser blob. `Partial<T>` is ideal for overrides — values remain checked. `satisfies` User on literal fixtures also catches missing fields without widening. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `function userFixture(overrides) {
  return { id: "1", email: "a@b.co", ...overrides };
}

userFixture({ email: 1 });
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Overrides are unchecked; email becomes a number.",
  },
  ts: {
    code: `type User = { id: string; email: string };

function userFixture(overrides: Partial<User> = {}): User {
  return { id: "1", email: "a@b.co", ...overrides };
}

userFixture({ email: 1 });
`,
    highlights: [{ start: 7, end: 7 }],
    caption:
      "`Partial<User>` still requires override values to match field types.",
    expectedDiagnostics: [{ code: 2322, line: 7, messageIncludes: "number" }],
  },
  insight: [
    "Type factories as returning the production type, not a looser blob.",
    "`Partial<T>` is ideal for overrides — values remain checked.",
    "`satisfies` User on literal fixtures also catches missing fields without widening.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does `Partial<User>` mean for overrides?",
      choices: [
        { id: "a", text: "All fields required" },
        { id: "b", text: "All fields optional, but still correctly typed" },
        { id: "c", text: "Fields become `any`" },
        { id: "d", text: "User is erased" },
      ],
      answerId: "b",
      explanation: "Each present override must match the original field type.",
    },
  ],
  exercise: {
    prompt: "Override email with a string.",
    starter: `type User = { id: string; email: string };

function userFixture(overrides: Partial<User> = {}): User {
  return { id: "1", email: "a@b.co", ...overrides };
}

userFixture({ email: 1 });
`,
    assertion: "no-errors",
    hints: ['email: "b@c.co"'],
    solution: `type User = { id: string; email: string };

function userFixture(overrides: Partial<User> = {}): User {
  return { id: "1", email: "a@b.co", ...overrides };
}

userFixture({ email: "b@c.co" });
`,
  },
};
