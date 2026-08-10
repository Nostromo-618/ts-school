import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "call-and-construct-signatures",
  title: "Callable and constructable types",
  tier: "intermediate",
  track: "functions",
  order: 14,
  summary:
    "Objects that are also functions, and types that describe a class rather than its instances: (…): T and new (…): T.",
  prerequisites: ["function-type-expressions", "interfaces-intro"],
  keywords: [
    "call signature",
    "construct signature",
    "new",
    "callable",
    "factory",
  ],
  problem:
    "A factory that takes a class and returns instances of it cannot be typed with a plain function type.",
  js: {
    code: `function make(C, arg) { return new C(arg); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "new on an `unknown` constructor.",
  },
  ts: {
    code: `type Ctor<T> = new (name: string) => T;

class User {
  constructor(readonly name: string) {}
}

function make<T>(C: Ctor<T>, name: string): T {
  return new C(name);
}

const u = make(User, "Ada");
const bad = make(User, 1);
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Ctor signature requires string. number fails.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 12,
        messageIncludes: "Argument of type 'number' is not assignable to p",
      },
    ],
  },
  insight: [
    "new (...) => T describes constructible values.",
    "(...) => T describes callables — do not confuse them.",
    "Factories that accept classes need construct signatures.",
  ],
};
