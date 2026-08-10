import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "mocking-modules",
  title: "Typed module mocks",
  tier: "intermediate",
  track: "testing",
  order: 6,
  summary:
    "vi.mock and jest.mock erase types unless you help them. MockedFunction, mocked(), and keeping the mock's signature tied to the real one.",
  prerequisites: ["typing-mocks-and-stubs", "typeof-type-queries"],
  keywords: [
    "vi.mock",
    "jest.mock",
    "MockedFunction",
    "module mock",
    "typeof import",
  ],
  problem:
    "Mocked module with untyped factory. A test that compiles while asserting the wrong contract is worse than no test: it freezes the bug in CI. Type the fixture and the expectation so the checker helps the assertion. Type the assertion so a wrong expectation fails compilation.",
  solution:
    "Generic mockModule preserves connect's `Promise<`void`>`. Type the mocked module surface explicitly. Factory return values must satisfy that surface. Prefer dependency injection when mocks get heavy. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `jest.mock('./db');
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Mocked module with untyped factory.",
  },
  ts: {
    code: `// Module mocks still need the public type of the module.
type DbModule = { connect(): Promise<void> };
declare function mockModule<T>(factory: () => T): T;
const db = mockModule<DbModule>(() => ({
  connect: async () => undefined,
}));
const p: Promise<void> = db.connect();
const bad: number = db.connect();
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Generic mockModule preserves connect's `Promise<`void`>`.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 8,
        messageIncludes: "Type 'Promise<void>' is not assignable to type '",
      },
    ],
  },
  insight: [
    "Type the mocked module surface explicitly.",
    "Factory return values must satisfy that surface.",
    "Prefer dependency injection when mocks get heavy.",
  ],
};
