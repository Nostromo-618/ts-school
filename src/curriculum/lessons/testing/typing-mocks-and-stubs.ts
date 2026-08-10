import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-mocks-and-stubs",
  title: "Mocks that satisfy the interface",
  tier: "intermediate",
  track: "testing",
  order: 4,
  summary:
    "Structural typing means a fake only needs the parts you use — as long as the type says so rather than a cast.",
  prerequisites: ["structural-typing", "typed-fixtures-and-factories"],
  keywords: ["mock", "stub", "fake", "interface", "structural", "test double"],
  problem:
    "Mock returns a wrong-shaped user. A test that compiles while asserting the wrong contract is worse than no test: it freezes the bug in CI. Type the fixture and the expectation so the checker helps the assertion. Type the assertion so a wrong expectation fails compilation.",
  solution:
    "Mock must satisfy Db. u is User | `undefined`, not number. Type mocks as the real dependency interface. async mocks should return Promises. Avoid `any` in test doubles. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `const db = { get: () => ({ id: 1 }) };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Mock returns a wrong-shaped user.",
  },
  ts: {
    code: `type User = { id: string };
type Db = { get(id: string): Promise<User | undefined> };

const db: Db = {
  get: async (id) => ({ id }),
};

const u = await db.get("1");
const bad: number = u;
`,
    highlights: [{ start: 9, end: 9 }],
    caption: "Mock must satisfy Db. u is User | `undefined`, not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 9,
        messageIncludes: "Type 'User | undefined' is not assignable to typ",
      },
    ],
  },
  insight: [
    "Type mocks as the real dependency interface.",
    "async mocks should return Promises.",
    "Avoid `any` in test doubles.",
  ],
  exercise: {
    prompt:
      "Type db as Db and make get return `Promise<User | undefined>`. Match the solution text.",
    starter: `type User = { id: string };
type Db = { get(id: string): Promise<User | undefined> };

const db = {
  get: (id) => ({ id }),
};
`,
    assertion: "no-errors",
    hints: ["const db: Db = { get: async (id) => ({ id }) };"],
    solution: `type User = { id: string };
type Db = { get(id: string): Promise<User | undefined> };

const db: Db = {
  get: async (id) => ({ id }),
};
void db;
`,
  },
};
