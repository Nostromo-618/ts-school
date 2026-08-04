import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-mocks-and-stubs",
  title: "Mocks that satisfy the interface",
  tier: "intermediate",
  track: "testing",
  order: 4,
  summary:
    "Structural typing means a fake only needs the parts you use â as long as the type says so rather than a cast.",
  prerequisites: ["structural-typing", "typed-fixtures-and-factories"],
  keywords: ["mock", "stub", "fake", "interface", "structural", "test double"],
  problem:
    "A mock cast to the full interface compiles today and silently misses the method added tomorrow.",
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
    caption: "Mock must satisfy Db. u is User | undefined, not number.",
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
    "Avoid any in test doubles.",
  ],
};
